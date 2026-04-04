export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
  try {
    const { userId, email } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      metadata: { userId },
      subscription_data: {
        trial_period_days: 3,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Slam5 Pro",
              description: "Unlimited access. Win every day.",
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/dashboard?payment=success`,
      cancel_url: `${request.nextUrl.origin}/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
