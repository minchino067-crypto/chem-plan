/* オフラインで開けるようにするだけの Service Worker。
   中身を更新したら VERSION を上げる（古いキャッシュはその時に捨てる）。 */
const VERSION = "v9";
const SHELL = "shell-" + VERSION;
const FONTS = "fonts-" + VERSION;

const ASSETS = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./sync.js",
  "./firebase-config.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => Promise.allSettled(
        ASSETS.map(u => c.add(new Request(u, { cache: "reload" })))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== SHELL && k !== FONTS).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* GitHub Pages は max-age=600 を返す。素の fetch はその 10 分間、
   ブラウザのHTTPキャッシュから古いファイルを返してしまい、
   「ネットワーク優先」が意味をなさない。毎回サーバーに確認させる
   （変わっていなければ 304 で返ってくるので重くはならない）。 */
function fresh(req) {
  try { return new Request(req, { cache: "no-cache" }); }
  catch (e) { return req; }
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Firebase は常にネットワーク（Service Worker は触らない）
  if (url.hostname === "www.gstatic.com" && url.pathname.includes("/firebasejs/")) return;
  if (url.hostname.endsWith("googleapis.com") && !url.hostname.startsWith("fonts.")) return;

  // フォント：あればキャッシュ、裏で更新
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(FONTS).then(async c => {
        const hit = await c.match(req);
        const net = fetch(req).then(r => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // 画面本体：まずネットワーク、駄目ならキャッシュ（更新が届くように）
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(fresh(req))
        .then(r => { const cp = r.clone(); caches.open(SHELL).then(c => c.put("./index.html", cp)); return r; })
        .catch(() => caches.match("./index.html", { ignoreSearch: true }).then(r => r || caches.match("./")))
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // アイコンなど変わらないもの：キャッシュ優先
  if (/\.(png|svg|ico|woff2?)$/i.test(url.pathname)) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(hit =>
        hit || fetch(req).then(r => {
          if (r.ok) { const cp = r.clone(); caches.open(SHELL).then(c => c.put(req, cp)); }
          return r;
        })
      )
    );
    return;
  }

  // コード（css/js/json）：まずネットワーク、駄目ならキャッシュ。
  // ここをキャッシュ優先にすると、更新しても古いままになる。
  e.respondWith(
    fetch(fresh(req))
      .then(r => {
        if (r.ok) { const cp = r.clone(); caches.open(SHELL).then(c => c.put(req, cp)); }
        return r;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
