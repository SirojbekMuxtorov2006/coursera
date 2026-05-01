import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe-Signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Stripe may send many event shapes; narrow where needed.

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // One-time purchase completed
    if (session.metadata?.type === "one-time") {
      const userId = session.metadata.userId;
      const courseId = session.metadata.courseId;
      const stripePaymentId = session.payment_intent as string | null;

      if (!userId || !courseId || !stripePaymentId) {
        return NextResponse.json({ received: true });
      }

      const existing = await db.purchase.findFirst({
        where: { stripePaymentId },
        select: { id: true },
      });

      if (!existing) {
        await db.purchase.create({
          data: {
            userId,
            courseId,
            amount: (session.amount_total || 0) / 100,
            purchaseType: "ONE_TIME",
            stripePaymentId,
          },
        });
      }

      await db.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: {},
        create: { userId, courseId },
      });
    }

    // Subscription created
    if (session.metadata?.type === "subscription") {
      const userId = session.metadata.userId;
      const plan = session.metadata.plan === "yearly" ? "YEARLY" : "MONTHLY";

      if (!userId) return NextResponse.json({ received: true });

      const sub = await stripe.subscriptions.retrieve(session.subscription as string);

      await db.subscription.upsert({
        where: { userId },
        update: {
          plan: plan as "MONTHLY" | "YEARLY",
          stripeCustomerId: session.customer as string,
          stripeSubId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
        },
        create: {
          userId,
          plan: plan as "MONTHLY" | "YEARLY",
          stripeCustomerId: session.customer as string,
          stripeSubId: sub.id,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
        },
      });
    }
  }

  // Subscription canceled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await db.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: { plan: "FREE", cancelAtPeriodEnd: true },
    });
  }

  // Subscription updated (e.g. renewals, cancel_at_period_end changes)
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const plan =
      subscription.status === "active" || subscription.status === "trialing"
        ? "MONTHLY"
        : "FREE";

    await db.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: {
        plan: plan as "MONTHLY" | "FREE",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end),
      },
    });
  }

  return NextResponse.json({ received: true });
}
