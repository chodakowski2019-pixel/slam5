export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_URL = "https://open.spotify.com/playlist/6Cf1qYa6QwYB70TVDBIaE3";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      attributes: { SOURCE: "slam5-playlist" },
      listIds: [3],
      updateEnabled: true,
    }),
  });

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: "Kuba from Slam5", email: "kuba@slam5.com" },
      to: [{ email }],
      subject: "Your ADHD focus playlist 🎧",
      htmlContent: buildEmail(email),
    }),
  });

  return NextResponse.json({ ok: true });
}

function buildEmail(email: string): string {
  void email;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">
        <tr><td style="padding-bottom:32px;">
          <span style="font-size:20px;font-weight:700;color:#ffffff;">Slam<span style="color:#34d399;">5</span></span>
        </td></tr>
        <tr><td style="padding-bottom:8px;">
          <span style="font-size:40px;">🎧</span>
        </td></tr>
        <tr><td style="padding-bottom:16px;">
          <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;">Your ADHD focus playlist is here.</h1>
        </td></tr>
        <tr><td style="background:#111111;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:24px;">
          <p style="margin:0 0 16px;font-size:15px;color:#9ca3af;line-height:1.6;">
            ADHD brains respond differently to music. No lyrics. No sudden changes. Just the right frequency to activate your focus without overstimulating you.
          </p>
          <p style="margin:0;font-size:15px;color:#ffffff;line-height:1.6;">
            Hit play. Let it run in the background. Then open your first task.
          </p>
        </td></tr>
        <tr><td style="height:24px;"></td></tr>
        <tr><td align="center" style="padding-bottom:8px;">
          <a href="${SPOTIFY_URL}" style="display:inline-block;background:linear-gradient(135deg,#10b981,#14b8a6);color:#ffffff;text-decoration:none;font-size:16px;font-weight:600;padding:16px 40px;border-radius:50px;">
            Open playlist on Spotify →
          </a>
        </td></tr>
        <tr><td style="padding-top:32px;padding-bottom:8px;">
          <p style="margin:0 0 12px;font-size:15px;color:#d1d5db;line-height:1.7;">
            Tomorrow I'll show you why your brain struggles to start — and why it's not your fault.
          </p>
          <p style="margin:0 0 4px;font-size:15px;color:#ffffff;">Kuba</p>
          <p style="margin:0;font-size:13px;color:#6b7280;">Founder of Slam5</p>
        </td></tr>
        <tr><td style="padding-top:8px;">
          <p style="margin:0;font-size:13px;color:#6b7280;text-align:center;">
            P.S. If the playlist helps you focus, wait until you see what Slam5 does. <a href="https://slam5.com" style="color:#34d399;">3 days free →</a>
          </p>
        </td></tr>
        <tr><td style="padding-top:40px;">
          <p style="margin:0;font-size:12px;color:#374151;text-align:center;">
            You're getting this because you signed up at slam5.com/playlist.<br>
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
