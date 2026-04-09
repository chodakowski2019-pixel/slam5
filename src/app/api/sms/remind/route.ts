import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER!;

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function sendSMS(to: string, message: string) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString("base64");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: TWILIO_FROM, Body: message }),
  });
  return res.json();
}

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function getTomorrowKey() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// Called by Vercel Cron every hour
export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer CRON_SECRET
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSb();
  const currentHour = new Date().getUTCHours(); // 0-23 UTC
  // plan_hour stored as "HH:00" e.g. "08:00", "20:00"
  const currentHourStr = `${currentHour.toString().padStart(2, "0")}:00`;

  // Get users whose plan_hour matches current UTC hour
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, name, phone_number, plan_hour")
    .eq("plan_hour", currentHourStr)
    .not("phone_number", "is", null)
    .neq("phone_number", "");

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;
  const today = getTodayKey();
  const tomorrow = getTomorrowKey();

  for (const profile of profiles) {
    const phone = profile.phone_number;
    if (!phone) continue;

    // Check if user already has tasks for today
    const { data: todayTasks } = await sb
      .from("tasks")
      .select("id")
      .eq("user_id", profile.id)
      .or(`scheduled_for.eq.${today},and(scheduled_for.is.null,created_at.gte.${today}T00:00:00,created_at.lt.${tomorrow}T00:00:00)`)
      .limit(1);

    if (!todayTasks || todayTasks.length === 0) {
      await sendSMS(
        phone,
        `Hey${profile.name ? " " + profile.name : ""}! You haven't picked your 5 tasks yet. Open Slam5 and plan your day.`
      );
      sent++;
    }
  }

  return NextResponse.json({ ok: true, sent });
}
