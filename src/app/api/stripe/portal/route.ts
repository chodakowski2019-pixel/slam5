export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-03-25.dahlia" as never });
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = auth.slice(7);

  const sb = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData } = await sb.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { data: profile } = await sb.from("profiles").select("stripe_customer_id").eq("id", userId).single();
  if (!profile?.stripe_customer_id) return NextResponse.json({ error: "No subscription found" }, { status: 400 });

  const session = await (stripe as Stripe).billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://slam5.com"}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
