import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/server-auth";
import { zCheckoutBody } from "@/lib/validators";
import { errorToResponse, jsonError, jsonOk } from "@/lib/http";

export async function POST(req: Request) {
  try {
    const session = await requireUser();

    const parsed = zCheckoutBody.safeParse(await req.json());
    if (!parsed.success) {
      return jsonError("Invalid request", 400, { issues: parsed.error.issues });
    }
    const { courseId, priceType } = parsed.data;

    // One-time course purchase
    if (priceType === "one-time" && courseId) {
      const course = await db.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return jsonError("Course not found", 404);
      }

      if (course.isFree || course.price <= 0) {
        return jsonError("This course is free", 400);
      }

      const alreadyEnrolled = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        select: { id: true },
      });
      if (alreadyEnrolled) {
        return jsonError("You already own this course", 409);
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

      return jsonOk({ url: checkoutSession.url });
    }

    // Subscription
    if (priceType === "monthly" || priceType === "yearly") {
      const priceId =
        priceType === "monthly"
          ? process.env.STRIPE_MONTHLY_PRICE_ID
          : process.env.STRIPE_YEARLY_PRICE_ID;

      if (!priceId) {
        return jsonError("Stripe price is not configured", 500);
      }

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

      return jsonOk({ url: checkoutSession.url });
    }

    return jsonError("Invalid request", 400);
  } catch (error) {
    console.error("Checkout error:", error);
    return errorToResponse(error);
  }
}
