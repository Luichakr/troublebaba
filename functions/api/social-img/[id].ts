// GET /api/social-img/<id>.jpg — serve a social tile we copied into R2.
// Counterpart to /api/admin/social-thumb. Cached hard at the edge: these
// images never change once written, and the whole point is that they no
// longer depend on Instagram's expiring signatures.

interface Env {
  PDF_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const raw = String((params as any).id || '');
  const id = raw.replace(/\.jpg$/i, '');
  if (!/^\d+$/.test(id)) return new Response('Not found', { status: 404 });

  const obj = await env.PDF_BUCKET.get(`social/${id}.jpg`);
  if (!obj) return new Response('Not found', { status: 404 });

  return new Response(obj.body, {
    headers: {
      'content-type': 'image/jpeg',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
