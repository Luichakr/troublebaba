// Minimal Resend email sender (https://resend.com/docs/api-reference/emails/send-email).
// RESEND_API_KEY is a Cloudflare env secret.

export interface ResendEnv {
  RESEND_API_KEY?: string;
  /** From address. Without a verified domain, use "onboarding@resend.dev". */
  RESEND_FROM?: string;
}

export async function sendEmail(env: ResendEnv, opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!env.RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not configured' };

  const from = env.RESEND_FROM || 'Bento Cake <onboarding@resend.dev>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
    });
    const body = await res.json<any>().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body?.message || `resend_http_${res.status}` };
    return { ok: true, id: body?.id };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'resend_fetch_failed' };
  }
}
