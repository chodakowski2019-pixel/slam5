import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

const DATA_PATH = path.join(process.cwd(), "data.json");

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeData(data: Record<string, unknown>) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  const data = readData();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      data.subscription = {
        status: "trialing",
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        currentPeriodEnd: null,
      };
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      data.subscription = {
        status: sub.status === "active" ? "active" : sub.status === "trialing" ? "trialing" : sub.status,
        stripeCustomerId: sub.customer as string,
        stripeSubscriptionId: sub.id,
        currentPeriodEnd: null,
      };
      break;
    }
    case "customer.subscription.deleted": {
      data.subscription = {
        ...data.subscription,
        status: "cancelled",
      };
      break;
    }
    case "invoice.payment_failed": {
      data.subscription = {
        ...data.subscription,
        status: "past_due",
      };
      break;
    }
  }

  writeData(data);
  return NextResponse.json({ received: true });
}
