// YouTube helpers — pull channel RSS + classify videos as shorts.
// Runs inside Cloudflare Workers (V8 isolate): no Node APIs, fetch + regex only.

export interface FeedEntry {
  videoId:     string;
  title:       string;
  publishedAt: number;        // ms epoch
  thumbnail:   string;        // hqdefault.jpg (always available)
}

const RSS_URL = (channelId: string) =>
  `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

// Bypass the EU consent wall when we fetch from a Cloudflare PoP that resolves
// to an EEA country (PL/UA edge). YouTube respects a pre-set consent cookie.
const CONSENT_COOKIE = 'CONSENT=YES+cb.20210328-17-p0.en+FX+999; SOCS=CAI';
const UA             = 'Mozilla/5.0 (compatible; TroublebabaBot/1.0; +https://troublebaba.com)';

/** Parse the channel's Atom feed (15 most-recent uploads). */
export async function fetchFeed(channelId: string): Promise<FeedEntry[]> {
  const r = await fetch(RSS_URL(channelId), {
    headers: { 'User-Agent': UA, 'Accept': 'application/atom+xml' },
    cf: { cacheTtl: 300, cacheEverything: true },
  } as RequestInit);
  if (!r.ok) throw new Error(`feed http ${r.status}`);
  const xml = await r.text();

  // Atom <entry> blocks. We avoid a full XML parser (none in CF Workers) and use
  // narrow regex per field — feed schema is stable and ours alone to consume.
  const entries: FeedEntry[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(xml))) {
    const block     = m[1];
    const videoId   = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title     = block.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
    const published = block.match(/<published>([^<]+)<\/published>/)?.[1];
    if (!videoId || !title || !published) continue;
    entries.push({
      videoId,
      title:       decodeXml(title),
      publishedAt: Date.parse(published),
      thumbnail:   `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    });
  }
  return entries;
}

/**
 * A YouTube video is a "short" iff /watch?v=ID's canonical link rewrites to
 * /shorts/ID. (Regular long-form videos keep /watch?v= as canonical.)
 * One HTTP fetch per video, but we only call this for entries we haven't seen
 * before, so amortised cost is low.
 */
export async function isShort(videoId: string): Promise<boolean> {
  const r = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: { 'User-Agent': UA, 'Cookie': CONSENT_COOKIE, 'Accept-Language': 'en' },
    redirect: 'follow',
    cf: { cacheTtl: 86400, cacheEverything: true },
  } as RequestInit);
  if (!r.ok) return false;
  const html = await r.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
  return canonical.includes('/shorts/');
}

// Atom <title> can contain &amp; &lt; &gt; &quot; &apos; — decode for storage.
function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
