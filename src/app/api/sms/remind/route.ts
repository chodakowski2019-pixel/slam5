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

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await request.json(); // "morning", "evening", or "no_plan"
  const sb = getSb();

  // Get all users with phone numbers
  const { data: profiles } = await sb
    .from("profiles")
    .select("id, name, phone_number, plan_time, plan_hour")
    .not("phone_number", "is", null)
    .neq("phone_number", "");

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;

  for (const profile of profiles) {
    const phone = profile.phone_number;
    if (!phone) continue;

    const today = getTodayKey();
    const tomorrow = getTomorrowKey();

    if (type === "morning") {
      // Get today's tasks
      const { data: tasks } = await sb
        .from("tasks")
        .select("title, is_frog")
        .eq("user_id", profile.id)
        .gte("created_at", today + "T00:00:00")
        .lt("created_at", tomorrow + "T00:00:00");

      let message: string;
      if (!tasks || tasks.length === 0) {
        message = `Hey ${profile.name || ""}! No tasks yet. Open Slam5 and pick your 5.`;
      } else {
        const list = tasks
          .map((t, i) => `${i + 1}. ${t.is_frog ? "🐸 " : ""}${t.title}`)
          .join("\n");
        message = `Your ${tasks.length} tasks today:\n${list}\n\nSlam them.`;
      }
      await sendSMS(phone, message);
      sent++;
    } else if (type === "evening") {
      // Get today's tasks for verdict
      const { data: tasks } = await sb
        .from("tasks")
        .select("completed")
        .eq("user_id", profile.id)
        .gte("created_at", today + "T00:00:00")
        .lt("created_at", tomorrow + "T00:00:00");

      const total = tasks?.length || 0;
      const completed = tasks?.filter((t) => t.completed).length || 0;
      const won = total > 0 && completed === total;

      let message: string;
      if (total === 0) {
        message = "You set 0 tasks today. That's an L. Show up tomorrow.";
      } else if (won) {
        message = `${completed}/${total} DONE. YOU WON TODAY. Keep going.`;
      } else {
        message = `${completed}/${total} done. Day lost. Come back harder tomorrow.`;
      }
      await sendSMS(phone, message);
      sent++;
    } else if (type === "no_plan") {
      // Check if user has tasks for tomorrow — if not, remind them
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      const dayAfterKey = dayAfter.toISOString().split("T")[0];

      const { data: tomorrowTasks } = await sb
        .from("tasks")
        .select("id")
        .eq("user_id", profile.id)
        .gte("created_at", tomorrow + "T00:00:00")
        .lt("created_at", dayAfterKey + "T00:00:00")
        .limit(1);

      if (!tomorrowTasks || tomorrowTasks.length === 0) {
        await sendSMS(phone, `Hey ${profile.name || ""}! You haven't planned tomorrow yet. Open Slam5 and pick your 5.`);
        sent++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}
