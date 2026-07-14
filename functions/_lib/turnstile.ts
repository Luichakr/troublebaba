// Cloudflare Turnstile server-side verification.
// Used by the public form endpoints (waitlist, free-recipe) to reject bots.
//
// ponytail: if TURNSTILE_SECRET is not set, verification is skipped (returns
// true) so forms keep working before the widget is configured. Set the secret
// in CF Pages env to turn enforcement on.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(secret: string | undefined, token: unknown, ip?: string | null): Promise<boolean> {
  if (!secret) return true;                       // not configured yet → don't block
  if (typeof token !== 'string' || !token) return false;

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body: form });
    const data = await res.json<{ success?: boolean }>();
    return data.success === true;
  } catch {
    return false;                                 // fail closed on network error
  }
}
