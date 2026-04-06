import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const token = auth.slice(7);

  const sb = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData } = await sb.auth.getUser(token);
  const userId = userData.user?.id;
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  // Delete all user data
  await Promise.all([
    sb.from("tasks").delete().eq("user_id", userId),
    sb.from("projects").delete().eq("user_id", userId),
    sb.from("goals").delete().eq("user_id", userId),
    sb.from("parking_lot").delete().eq("user_id", userId),
    sb.from("day_records").delete().eq("user_id", userId),
  ]);
  await sb.from("profiles").delete().eq("id", userId);

  // Delete auth user
  await sb.auth.admin.deleteUser(userId);

  return NextResponse.json({ ok: true });
}
