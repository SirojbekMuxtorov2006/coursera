import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Use a stable Stripe API version supported by the installed SDK.
  apiVersion: "2024-06-20",
  typescript: true,
});
