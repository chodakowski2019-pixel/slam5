export const dynamic = "force-dynamic";

// sendBeacon sends as text/plain with no custom headers
// We embed the token in the JSON body instead
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    const token = data._token;
    if (!token) return NextResponse.json({ ok: false });

    const sb = createClient(supabaseUrl, supabaseServiceKey);
    const { data: userData } = await sb.auth.getUser(token);
    const userId = userData.user?.id;
    if (!userId) return NextResponse.json({ ok: false });

    // Save tasks only (most critical data)
    await sb.from("tasks").delete().eq("user_id", userId);
    if (data.tasks?.length > 0) {
      await sb.from("tasks").insert(
        data.tasks.map((t: Record<string, unknown>) => ({
          id: t.id,
          user_id: userId,
          title: t.title,
          completed: t.completed,
          project_id: t.projectId,
          category: t.category,
          is_frog: t.isFrog,
          timer_minutes: t.timerMinutes,
          timer_seconds_left: t.timerSecondsLeft,
          timer_running: false,
          points: t.points,
          created_at: t.createdAt,
          completed_at: t.completedAt,
        }))
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
