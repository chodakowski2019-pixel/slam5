import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER!;
const DATA_PATH = path.join(process.cwd(), "data.json");

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

export async function POST(request: NextRequest) {
  // Simple auth — pass ?secret=YOUR_CRON_SECRET
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await request.json(); // "morning" or "evening"

  let data;
  try {
    data = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return NextResponse.json({ error: "No data" }, { status: 500 });
  }

  const phone = data.phoneNumber;
  if (!phone) {
    return NextResponse.json({ error: "No phone number set" }, { status: 400 });
  }

  const today = getTodayKey();
  const todayTasks = (data.tasks || []).filter(
    (t: { createdAt: string }) => t.createdAt.startsWith(today)
  );

  let message: string;

  if (type === "morning") {
    if (todayTasks.length === 0) {
      message = "🥊 Slam5: No tasks yet. Open the app and pick your 5. Win today.";
    } else {
      const taskList = todayTasks
        .map((t: { title: string; isFrog: boolean }, i: number) => `${i + 1}. ${t.isFrog ? "🐸 " : ""}${t.title}`)
        .join("\n");
      message = `🥊 Slam5 — Your ${todayTasks.length} tasks today:\n${taskList}\n\nSlam them. No excuses.`;
    }
  } else if (type === "evening") {
    const completed = todayTasks.filter((t: { completed: boolean }) => t.completed).length;
    const total = todayTasks.length;
    const won = total > 0 && completed === total;
    if (total === 0) {
      message = "🥊 Slam5: You set 0 tasks today. That's an automatic L. Tomorrow, show up.";
    } else if (won) {
      message = `🏆 Slam5: ${completed}/${total} DONE. YOU WON TODAY. Stack another W tomorrow.`;
    } else {
      message = `❌ Slam5: ${completed}/${total} done. You lost today. No sugar coating. Come back harder tomorrow.`;
    }
  } else {
    return NextResponse.json({ error: "type must be 'morning' or 'evening'" }, { status: 400 });
  }

  const result = await sendSMS(phone, message);
  return NextResponse.json({ ok: true, message, sms: result });
}
