import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId, priceType } = await req.json();

    // One-time course purchase
    if (priceType === "one-time" && courseId) {
      const course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: session.user.email!,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: course.title,
                description: course.shortDesc || course.description.slice(0, 200),
              },
              unit_amount: Math.round(course.price * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
          courseId: course.id,
          type: "one-time",
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?canceled=true`,
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Subscription
    if (priceType === "monthly" || priceType === "yearly") {
      const priceId =
        priceType === "monthly"
          ? process.env.STRIPE_MONTHLY_PRICE_ID
          : process.env.STRIPE_YEARLY_PRICE_ID;

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: session.user.email!,
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: {
          userId: session.user.id,
          type: "subscription",
          plan: priceType,
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
