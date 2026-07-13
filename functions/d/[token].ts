// GET /d/<token> — gated PDF download. Verifies signed token (auth + 7-day
// expiry), enforces a 3-download cap via a small R2 counter object, then streams
// the private file from R2. No public direct link to the file exists.

import { verifyDownloadToken } from '../_lib/dl';

const FILE_KEY = 'bento-cake-troublebaba.pdf';
const MAX_DOWNLOADS = 3;

interface Env {
  PDF_BUCKET: R2Bucket;
  CRON_SECRET?: string;
}

function gone(msg: string): Response {
  return new Response(msg, { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const token = String((params as any).token || '');
  const v = await verifyDownloadToken(env.CRON_SECRET || '', token);
  if (!v.ok) {
    if (v.reason === 'expired') return gone('Термін дії посилання минув (7 днів). Напишіть у Instagram @troublebaba.');
    return new Response('Недійсне посилання.', { status: 403 });
  }

  // Per-link download counter (naive read-then-write; races are irrelevant at this scale).
  // ponytail: R2 counter, no locking — a rare double-download won't over/undercount meaningfully.
  const counterKey = `dl-count/${v.sig}`;
  const cur = await env.PDF_BUCKET.get(counterKey);
  const n = cur ? parseInt(await cur.text(), 10) || 0 : 0;
  if (n >= MAX_DOWNLOADS) return gone(`Ліміт завантажень вичерпано (${MAX_DOWNLOADS}). Напишіть у Instagram @troublebaba.`);
  await env.PDF_BUCKET.put(counterKey, String(n + 1));

  const obj = await env.PDF_BUCKET.get(FILE_KEY);
  if (!obj) return new Response('Файл тимчасово недоступний.', { status: 503 });

  return new Response(obj.body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'attachment; filename="Bento Cake by TROUBLEBABA.pdf"',
      'cache-control': 'no-store',
    },
  });
};
