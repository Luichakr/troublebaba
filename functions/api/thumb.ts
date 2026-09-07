// GET /api/thumb?src=<encoded-image-url>
//
// Server-side proxy for social CDN thumbnails (Instagram scontent.*,
// TikTok tiktokcdn-*, etc). The <img> tag on the browser side can't load
// those directly because the CDNs enforce Referer / hotlink protection and
// return 403 for cross-site loads. We fetch them here with the right host
// as Referer, then hand back the bytes with a long edge cache so subsequent
// loads are instant.
//
// Also guards against SSRF: only whitelisted host suffixes are proxied.

const ALLOWED_HOST_SUFFIXES = [
  '.cdninstagram.com',
  '.fbcdn.net',
  '.tiktokcdn.com',
  '.tiktokcdn-us.com',
  '.tiktokcdn-eu.com',
  '.ttwstatic.com',
  '.ytimg.com',
  'i.ytimg.com',
];

const CACHE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function refererFor(host: string): string {
  if (host.includes('cdninstagram') || host.includes('fbcdn')) return 'https://www.instagram.com/';
  if (host.includes('tiktok')) return 'https://www.tiktok.com/';
  return 'https://www.google.com/';
}

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const src = url.searchParams.get('src');
  if (!src) return new Response('missing src', { status: 400 });

  let target: URL;
  try { target = new URL(src); }
  catch { return new Response('bad url', { status: 400 }); }

  if (target.protocol !== 'https:') return new Response('https only', { status: 400 });

  const host = target.hostname.toLowerCase();
  const ok = ALLOWED_HOST_SUFFIXES.some(suf =>
    suf.startsWith('.') ? host.endsWith(suf) : host === suf,
  );
  if (!ok) return new Response('host not allowed', { status: 403 });

  const upstream = await fetch(target.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Referer': refererFor(host),
      'Accept-Language': 'en-US,en;q=0.9',
    },
    // 7-day CF cache for the upstream fetch — dramatically cuts CDN pressure.
    cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true } as any,
  });

  if (!upstream.ok) {
    return new Response(`upstream ${upstream.status}`, { status: 502 });
  }

  const type = upstream.headers.get('Content-Type') || 'image/jpeg';
  const headers = new Headers({
    'Content-Type': type,
    // Long client + edge cache. Even if the signed URL under our proxy
    // expires upstream, whatever we cached at the edge keeps serving.
    'Cache-Control': `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, immutable`,
    'X-Content-Type-Options': 'nosniff',
    'Cross-Origin-Resource-Policy': 'cross-origin',
  });
  return new Response(upstream.body, { status: 200, headers });
};

export const onRequest: PagesFunction = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'GET' } });
