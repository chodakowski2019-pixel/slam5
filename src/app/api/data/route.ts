import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getUser(request: NextRequest) {
  // Extract user from Authorization header (Bearer token)
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

async function getUserId(accessToken: string) {
  const sb = createClient(supabaseUrl, supabaseServiceKey);
  const { data } = await sb.auth.getUser(accessToken);
  return data.user?.id ?? null;
}

// GET — load all user data from Supabase
export async function GET(request: NextRequest) {
  const token = getUser(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getUserId(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const sb = createClient(supabaseUrl, supabaseServiceKey);

  const [profileRes, tasksRes, projectsRes, goalsRes, parkingRes, recordsRes] = await Promise.all([
    sb.from("profiles").select("*").eq("id", userId).single(),
    sb.from("tasks").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    sb.from("projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    sb.from("goals").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    sb.from("parking_lot").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    sb.from("day_records").select("*").eq("user_id", userId).order("date", { ascending: false }),
  ]);

  const profile = profileRes.data;

  // Map DB rows to frontend format
  const tasks = (tasksRes.data || []).map((t) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    projectId: t.project_id,
    category: t.category,
    isFrog: t.is_frog,
    timerMinutes: t.timer_minutes,
    timerSecondsLeft: t.timer_seconds_left,
    timerRunning: t.timer_running,
    points: t.points,
    createdAt: t.created_at,
    completedAt: t.completed_at,
  }));

  const projects = (projectsRes.data || []).map((p) => ({
    id: p.id,
    name: p.name,
    emoji: p.emoji,
    color: p.color,
    description: p.description,
    createdAt: p.created_at,
  }));

  const goals = (goalsRes.data || []).map((g) => ({
    id: g.id,
    title: g.title,
    description: g.description,
    deadline: g.deadline,
    horizon: g.horizon,
    progress: g.progress,
    milestones: g.milestones || [],
    projectId: g.project_id,
    completed: g.completed,
    createdAt: g.created_at,
  }));

  const parkingLot = (parkingRes.data || []).map((p) => ({
    id: p.id,
    text: p.text,
    createdAt: p.created_at,
  }));

  const dayRecords = (recordsRes.data || []).map((r) => ({
    date: r.date,
    tasksTotal: r.tasks_total,
    tasksCompleted: r.tasks_completed,
    won: r.won,
    points: r.points,
  }));

  return NextResponse.json({
    tasks,
    projects,
    goals,
    parkingLot,
    dayRecords,
    totalPoints: profile?.total_points || 0,
    profile: profile ? {
      name: profile.name,
      phoneNumber: profile.phone_number,
      bodyGoal: profile.body_goal,
      mindGoal: profile.mind_goal,
      moneyGoal: profile.money_goal,
      planTime: profile.plan_time,
      planHour: profile.plan_hour,
      onboardingCompleted: profile.onboarding_completed,
    } : undefined,
    subscription: profile ? {
      status: profile.subscription_status || "none",
      stripeCustomerId: profile.stripe_customer_id,
      stripeSubscriptionId: profile.stripe_subscription_id,
      currentPeriodEnd: profile.current_period_end,
    } : undefined,
  });
}

// POST — save all user data to Supabase
export async function POST(request: NextRequest) {
  const token = getUser(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = await getUserId(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const data = await request.json();
  const sb = createClient(supabaseUrl, supabaseServiceKey);

  // Update profile
  if (data.profile) {
    await sb.from("profiles").upsert({
      id: userId,
      name: data.profile.name,
      phone_number: data.profile.phoneNumber,
      body_goal: data.profile.bodyGoal,
      mind_goal: data.profile.mindGoal,
      money_goal: data.profile.moneyGoal,
      plan_time: data.profile.planTime,
      plan_hour: data.profile.planHour,
      onboarding_completed: data.profile.onboardingCompleted,
      total_points: data.totalPoints || 0,
      updated_at: new Date().toISOString(),
    });
  } else {
    await sb.from("profiles").upsert({
      id: userId,
      total_points: data.totalPoints || 0,
      updated_at: new Date().toISOString(),
    });
  }

  // Upsert tasks individually — never delete all first
  if (data.tasks?.length > 0) {
    const rows = data.tasks.map((t: Record<string, unknown>) => ({
      id: t.id,
      user_id: userId,
      title: t.title,
      completed: t.completed,
      project_id: t.projectId,
      category: t.category,
      is_frog: t.isFrog,
      timer_minutes: t.timerMinutes,
      timer_seconds_left: t.timerSecondsLeft,
      timer_running: t.timerRunning,
      points: t.points,
      created_at: t.createdAt,
      completed_at: t.completedAt,
    }));
    await sb.from("tasks").upsert(rows, { onConflict: "id" });
  }
  // Delete tasks that were removed by user
  if (data.deletedTaskIds?.length > 0) {
    await sb.from("tasks").delete().eq("user_id", userId).in("id", data.deletedTaskIds);
  }

  // Upsert projects
  if (data.projects?.length > 0) {
    const rows = data.projects.map((p: Record<string, unknown>) => ({
      id: p.id,
      user_id: userId,
      name: p.name,
      emoji: p.emoji,
      color: p.color,
      description: p.description,
      created_at: p.createdAt,
    }));
    await sb.from("projects").upsert(rows, { onConflict: "id" });
  }
  if (data.deletedProjectIds?.length > 0) {
    await sb.from("projects").delete().eq("user_id", userId).in("id", data.deletedProjectIds);
  }

  // Upsert goals
  if (data.goals?.length > 0) {
    const rows = data.goals.map((g: Record<string, unknown>) => ({
      id: g.id,
      user_id: userId,
      title: g.title,
      description: g.description,
      deadline: g.deadline,
      horizon: g.horizon,
      progress: g.progress,
      milestones: g.milestones,
      project_id: g.projectId,
      completed: g.completed,
      created_at: g.createdAt,
    }));
    await sb.from("goals").upsert(rows, { onConflict: "id" });
  }
  if (data.deletedGoalIds?.length > 0) {
    await sb.from("goals").delete().eq("user_id", userId).in("id", data.deletedGoalIds);
  }

  // Upsert parking lot
  if (data.parkingLot?.length > 0) {
    const rows = data.parkingLot.map((p: Record<string, unknown>) => ({
      id: p.id,
      user_id: userId,
      text: p.text,
      created_at: p.createdAt,
    }));
    await sb.from("parking_lot").upsert(rows, { onConflict: "id" });
  }
  if (data.deletedParkingIds?.length > 0) {
    await sb.from("parking_lot").delete().eq("user_id", userId).in("id", data.deletedParkingIds);
  }

  // Sync day records — upsert by (user_id, date)
  if (data.dayRecords?.length > 0) {
    for (const r of data.dayRecords) {
      await sb.from("day_records").upsert(
        {
          user_id: userId,
          date: (r as Record<string, unknown>).date,
          tasks_total: (r as Record<string, unknown>).tasksTotal,
          tasks_completed: (r as Record<string, unknown>).tasksCompleted,
          won: (r as Record<string, unknown>).won,
          points: (r as Record<string, unknown>).points,
        },
        { onConflict: "user_id,date" }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
