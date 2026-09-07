// POST /api/admin/social-thumb  — store a social thumbnail in R2 and point the
// feed row at our own copy.
//
// Why this exists: Instagram CDN URLs are signed and expire, and Instagram
// answers our server with 401/403, so the cron sync cannot refresh them — the
// blog tiles silently went blank. The images ARE loaded in a logged-in browser
// though, so we let the browser read them off a canvas and POST them here.
// Once the bytes live in R2 the tiles keep working forever, with no dependency
// on Instagram's signatures.
//
// Body: { id: number, b64: string }   — id is social_posts.id, b64 is raw JPEG
// Auth: Bearer CRON_TOKEN (same token the social-sync cron already uses).

interface Env {
  DB: D1Database;
  PDF_BUCKET: R2Bucket;
  CRON_TOKEN?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {

  // Accept both JSON and a plain form POST. Instagram's CSP blocks fetch() to
  // other origins, but it does not block submitting a form, so the browser-side
  // helper falls back to a form when fetch is refused.
  let body: { id?: number; b64?: string; token?: string };
  const ctype = request.headers.get('content-type') || '';
  try {
    if (ctype.includes('application/json')) {
      body = await request.json();
    } else {
      const fd = await request.formData();
      body = { id: Number(fd.get('id')), b64: String(fd.get('b64') || ''), token: String(fd.get('token') || '') } as any;
    }
  } catch {
    return Response.json({ ok: false, error: 'bad_body' }, { status: 400 });
  }

  if (!env.CRON_TOKEN || (request.headers.get('authorization') !== `Bearer ${env.CRON_TOKEN}` && (body as any).token !== env.CRON_TOKEN)) {
    return new Response('Forbidden', { status: 403 });
  }

  const id = Number(body.id);
  const b64 = String(body.b64 || '');
  if (!id || !b64) return Response.json({ ok: false, error: 'missing_id_or_b64' }, { status: 400 });
  // ~1.4 MB of base64 is plenty for a 340px tile; refuse anything larger.
  if (b64.length > 1_400_000) return Response.json({ ok: false, error: 'too_large' }, { status: 413 });

  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const key = `social/${id}.jpg`;
  await env.PDF_BUCKET.put(key, bin, { httpMetadata: { contentType: 'image/jpeg' } });

  const localUrl = `/api/social-img/${id}.jpg`;
  await env.DB.prepare('UPDATE social_posts SET thumbnail_url = ? WHERE id = ?').bind(localUrl, id).run();

  return Response.json({ ok: true, id, key, url: localUrl, bytes: bin.length });
};
