import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature") as string;

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

  const session = event.data.object as Stripe.Checkout.Session;

  // One-time purchase completed
  if (event.type === "checkout.session.completed" && session.metadata?.type === "one-time") {
    const userId = session.metadata.userId;
    const courseId = session.metadata.courseId;

    await db.purchase.create({
      data: {
        userId,
        courseId,
        amount: (session.amount_total || 0) / 100,
        purchaseType: "ONE_TIME",
        stripePaymentId: session.payment_intent as string,
      },
    });

    await db.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId },
    });
  }

  // Subscription created
  if (event.type === "checkout.session.completed" && session.metadata?.type === "subscription") {
    const userId = session.metadata.userId;
    const plan = session.metadata.plan === "yearly" ? "YEARLY" : "MONTHLY";

    const subResponse = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const sub = subResponse as unknown as Stripe.Subscription;

    await db.subscription.upsert({
      where: { userId },
      update: {
        plan: plan as "MONTHLY" | "YEARLY",
        stripeCustomerId: session.customer as string,
        stripeSubId: sub.id,
        currentPeriodEnd: new Date(((sub as unknown as Record<string, number>)["current_period_end"]) * 1000),
      },
      create: {
        userId,
        plan: plan as "MONTHLY" | "YEARLY",
        stripeCustomerId: session.customer as string,
        stripeSubId: sub.id,
        currentPeriodEnd: new Date(((sub as unknown as Record<string, number>)["current_period_end"]) * 1000),
      },
    });
  }

  // Subscription canceled
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await db.subscription.updateMany({
      where: { stripeSubId: subscription.id },
      data: { plan: "FREE", cancelAtPeriodEnd: true },
    });
  }

  return NextResponse.json({ received: true });
}
