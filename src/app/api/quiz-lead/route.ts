export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, result } = await request.json();

  if (!email || !result) {
    return NextResponse.json({ error: "Missing email or result" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const blockerLabels: Record<string, string> = {
    A: "The Overthinker",
    B: "The Low-Starter",
    C: "The Perfectionist",
    D: "The Overwhelmed",
  };

  // Add contact to Brevo
  const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      attributes: {
        BLOCKER_TYPE: result,
        BLOCKER_LABEL: blockerLabels[result] ?? result,
        SOURCE: "slam5-quiz",
      },
      listIds: [3],
      updateEnabled: true,
    }),
  });

  if (!contactRes.ok && contactRes.status !== 204) {
    const err = await contactRes.text();
    return NextResponse.json({ error: "Brevo contact error", detail: err, status: contactRes.status }, { status: 500 });
  }

  // Send transactional email
  const label = blockerLabels[result] ?? result;
  const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Slam5", email: "kuba@slam5.com" },
      to: [{ email }],
      subject: `Your blocker type: ${label}`,
      htmlContent: buildEmail(result, label),
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.text();
    return NextResponse.json({ ok: true, emailError: err, emailStatus: emailRes.status });
  }

  return NextResponse.json({ ok: true });
}

function buildEmail(result: string, label: string): string {
  const content: Record<string, { tagline: string; description: string; fix: string }> = {
    A: {
      tagline: "Your brain is a Ferrari with no GPS.",
      description:
        "The problem isn't effort. You can never decide which road to take. You'll think your way out of starting every single time. Analysis paralysis is your default mode.",
      fix: "Remove the choice. When the next task is already picked for you, you execute. Slam5 decides what's next. You just show up and go.",
    },
    B: {
      tagline: "Your engine takes longer to warm up.",
      description:
        "You're not lazy — you're waiting for a signal your brain isn't sending on its own. Willpower doesn't fix this. External activation does.",
      fix: "A trigger. A timer. Something that says NOW. Slam5's 25-minute sessions are designed exactly for brains that need a kickstart, not a pep talk.",
    },
    C: {
      tagline: "You don't have a productivity problem. You have a standards problem.",
      description:
        "'Good enough to start' doesn't exist in your vocabulary. Which means you rarely start at all. The bar keeps moving and the task never begins.",
      fix: "Time-boxing kills perfectionism. When you only have 25 minutes, 'perfect' isn't an option. Slam5 forces you to ship something imperfect. That's the whole point.",
    },
    D: {
      tagline: "You see the full mountain before you take step one.",
      description:
        "Your brain treats a 30-minute task like a 3-month project — and responds accordingly: shutdown. The bigger the list, the harder the freeze.",
      fix: "One task. One timer. No list visible. Slam5 hides the mountain and shows you only the next step.",
    },
  };

  const c = content[result];

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">
        <!-- Logo -->
        <tr><td style="padding-bottom:32px;">
          <span style="font-size:20px;font-weight:700;color:#ffffff;">Slam<span style="color:#34d399;">5</span></span>
        </td></tr>
        <!-- Label -->
        <tr><td style="padding-bottom:8px;">
          <span style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Your blocker type</span>
        </td></tr>
        <!-- Title -->
        <tr><td style="padding-bottom:8px;">
          <h1 style="margin:0;font-size:32px;font-weight:700;color:#ffffff;">${label}</h1>
        </td></tr>
        <!-- Tagline -->
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-size:16px;color:#d1d5db;">${c.tagline}</p>
        </td></tr>
        <!-- Card -->
        <tr><td style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="margin:0 0 20px;font-size:15px;color:#9ca3af;line-height:1.6;">${c.description}</p>
          <p style="margin:0 0 8px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">What actually fixes this</p>
          <p style="margin:0;font-size:15px;color:#ffffff;line-height:1.6;">${c.fix}</p>
        </td></tr>
        <!-- Spacer -->
        <tr><td style="height:32px;"></td></tr>
        <!-- Personal note -->
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0 0 12px;font-size:15px;color:#d1d5db;line-height:1.7;">It's the reason your to-do list grows but nothing gets done.<br>It's the reason you open your laptop and close it 20 minutes later.<br>It's the reason you know exactly what you need to do and still can't start.</p>
          <p style="margin:0 0 24px;font-size:15px;color:#d1d5db;line-height:1.7;">Tomorrow I'll show you why willpower never worked for you.<br><span style="color:#9ca3af;">(It's not your fault. Seriously.)</span></p>
          <p style="margin:0 0 4px;font-size:15px;color:#ffffff;">Kuba</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">Founder of Slam5</p>
        </td></tr>
        <!-- CTA -->
        <tr><td align="center" style="padding-bottom:8px;">
          <a href="https://slam5.com/login" style="display:inline-block;background:linear-gradient(135deg,#10b981,#14b8a6);color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 40px;border-radius:50px;">
            Try Slam5 free — 3 days, no card
          </a>
        </td></tr>
        <!-- PS -->
        <tr><td style="padding-top:16px;padding-bottom:8px;">
          <p style="margin:0;font-size:13px;color:#6b7280;text-align:center;">P.S. Your free trial starts the moment you're ready. No credit card. 3 days.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding-top:40px;">
          <p style="margin:0;font-size:12px;color:#374151;text-align:center;">
            You're getting this because you took the Slam5 quiz.<br>
            <a href="#" style="color:#6b7280;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}
