/**
 * Calling-card generator.
 *
 *   npm run card            → trim-size PDF + 600 DPI PNG/JPG (front & back)
 *   npm run card:bleed      → the same with 0.125 in bleed for commercial print
 *
 * Reads tools/calling-card/card.json. Output goes to tools/calling-card/out/
 * which is git-ignored on purpose: rendered cards carry personal details.
 * The QR code is decoded from the rendered PNG to prove it scans correctly.
 */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'card.json'), 'utf8'));
const C = cfg.colors; // roles: brownDark/brown/brownMid = primary shades, pink* = accent shades

// Fonts come from card.json ("fonts": { display, displayItalic, body }), each a path inside
// node_modules, so the card always uses the same self-hosted fonts as the site.
const fontFile = (rel) => 'file://' + path.join(ROOT, 'node_modules', rel);
const F = {
  fraunces: fontFile(cfg.fonts.display),
  frauncesItalic: fontFile(cfg.fonts.displayItalic || cfg.fonts.display),
  jakarta: fontFile(cfg.fonts.body),
};

// Card is 3.5in x 2in → 336 x 192 CSS px at 96 dpi. B = bleed in px (12 = 0.125in).
const W = 336, H = 192;
const B = Number(process.env.BLEED_PX || 0);
const SUFFIX = B ? '-bleed' : '';
const PW = W + 2 * B, PH = H + 2 * B;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// When card.json names a logoImage (path relative to the repo root), the client's own
// mark is used everywhere; otherwise the generic drawn tooth below is rendered.
const logoImageUrl = cfg.logoImage ? 'file://' + path.join(ROOT, cfg.logoImage) : null;
// "logoBadge": true in card.json puts the image on a white disc, for marks that need contrast
// against the coloured panel.
const logo = (size, ringA, ringB, toothA, toothB, smile, id) => logoImageUrl
  ? (cfg.logoBadge
      ? `<span style="display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.18)"><img src="${logoImageUrl}" width="${Math.round(size*0.68)}" height="${Math.round(size*0.68)}" style="display:block" alt=""></span>`
      : `<img src="${logoImageUrl}" width="${size}" height="${size}" style="display:block;border-radius:50%" alt="">`)
  : `
<svg viewBox="0 0 64 64" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="t${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${toothA}"/><stop offset="1" stop-color="${toothB}"/></linearGradient>
    <linearGradient id="r${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ringA}"/><stop offset="1" stop-color="${ringB}"/></linearGradient>
  </defs>
  <circle cx="32" cy="32" r="30" fill="url(#r${id})"/>
  <path d="M32 15c-5 0-5.8-2.4-10.6-1.6-5.6 1-7.9 6.4-7.1 11.6.8 6 4.2 9 5.8 16 .8 4.2 2.2 7.6 5.2 7.6 3.6 0 3.6-6 5.6-9 2 3 2 9 5.6 9 3 0 4.4-3.4 5.2-7.6 1.6-7 5-10 5.8-16 .8-5.2-1.5-10.6-7.1-11.6C37.8 12.6 37 15 32 15z" fill="url(#t${id})"/>
  <path d="M24.5 29.5q7.5 8.5 15 0" fill="none" stroke="${smile}" stroke-width="3" stroke-linecap="round"/>
  <path d="M46 10l1.3 3.2 3.2 1.3-3.2 1.3L46 19l-1.3-3.2-3.2-1.3 3.2-1.3z" fill="${C.pinkPale}"/>
</svg>`;

const icon = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 005 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  tooth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5c-2.2 0-2.6-1.2-4.9-.8C4.4 4.2 3.3 7 3.7 9.6c.4 3 2.1 4.5 2.9 8 .4 2.1 1.1 3.9 2.6 3.9 1.8 0 1.8-3 2.8-4.5 1 1.5 1 4.5 2.8 4.5 1.5 0 2.2-1.8 2.6-3.9.8-3.5 2.5-5 2.9-8 .4-2.6-.7-5.4-3.4-5.9-2.3-.4-2.7.8-4.9.8z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

async function main() {
  const qrSvg = await QRCode.toString(cfg.siteUrl, {
    type: 'svg', errorCorrectionLevel: 'H', margin: 0, color: { dark: C.brownDark, light: '#0000' },
  });
  const d = cfg.doctor, k = cfg.clinic, ct = cfg.contact;

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face { font-family: 'Fraunces'; src: url('${F.fraunces}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'Fraunces'; src: url('${F.frauncesItalic}') format('woff2'); font-weight: 100 900; font-style: italic; }
    @font-face { font-family: 'Jakarta'; src: url('${F.jakarta}') format('woff2'); font-weight: 200 800; }
    :root { --b: ${B}px; }
    @page { size: ${PW}px ${PH}px; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; }
    body { font-family: 'Jakarta', sans-serif; color: ${C.brownDark}; -webkit-font-smoothing: antialiased; }
    .card { width: ${PW}px; height: ${PH}px; position: relative; overflow: hidden; background: ${C.cream}; page-break-after: always; break-after: page; }
    .card:last-child { page-break-after: auto; break-after: auto; }

    .front { display: grid; grid-template-columns: calc(118px + var(--b)) 1fr; }
    .front .panel { position: relative; background: linear-gradient(160deg, ${C.brownMid} 0%, ${C.brown} 55%, ${C.brownDark} 100%); color: ${C.pinkPale}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: calc(14px + var(--b)) 10px calc(14px + var(--b)) calc(10px + var(--b)); text-align: center; overflow: hidden; }
    .front .panel::before { content: ''; position: absolute; width: 150px; height: 150px; border-radius: 50%; right: -70px; top: -70px; background: radial-gradient(circle, rgba(248,200,212,.28), transparent 70%); }
    .front .panel::after { content: ''; position: absolute; width: 120px; height: 120px; border-radius: 50%; left: -60px; bottom: -60px; background: radial-gradient(circle, rgba(248,200,212,.18), transparent 70%); }
    .front .panel svg { position: relative; filter: drop-shadow(0 3px 6px rgba(0,0,0,.25)); }
    .front .clinic { position: relative; margin-top: 8px; font-family: 'Fraunces', serif; font-weight: 600; font-size: 11.5px; line-height: 1.12; color: #fff; }
    .front .sub { position: relative; margin-top: 4px; font-size: 5.2px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: ${C.pink}; }
    .front .est { position: relative; margin-top: 10px; font-size: 5px; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.55); }
    .front .body { position: relative; padding: calc(16px + var(--b)) calc(16px + var(--b)) calc(14px + var(--b)) 18px; display: flex; flex-direction: column; }
    .front .body::before { content: ''; position: absolute; right: -40px; top: -40px; width: 130px; height: 130px; border-radius: 50%; background: radial-gradient(circle, ${C.pinkPale} 0%, rgba(248,200,212,0) 70%); opacity: .9; }
    .front .name { position: relative; font-family: 'Fraunces', serif; font-weight: 600; font-size: 17px; line-height: 1.05; color: ${C.brownDark}; letter-spacing: -.01em; }
    .front .name .dr { font-weight: 400; font-style: italic; color: ${C.brownLight}; }
    .front .name .dmd { font-family: 'Jakarta', sans-serif; font-weight: 800; font-size: 8px; letter-spacing: .12em; color: ${C.pinkDeep}; margin-left: 5px; vertical-align: 3px; }
    .front .role { position: relative; margin-top: 3px; font-size: 6.6px; font-weight: 600; color: ${C.brownMid}; letter-spacing: .02em; }
    .front .rule { position: relative; width: 26px; height: 2px; border-radius: 2px; background: ${C.pink}; margin: 9px 0 9px; }
    .front .tag { position: relative; font-family: 'Fraunces', serif; font-size: 8.2px; font-weight: 500; color: ${C.brown}; line-height: 1.2; }
    .front .tag em { font-style: italic; color: ${C.pinkDeep}; }
    .front .rows { position: relative; display: grid; gap: 5.5px; margin-top: auto; }
    .front .row { display: grid; grid-template-columns: 13px 1fr; align-items: center; gap: 6px; font-size: 7.2px; font-weight: 600; color: ${C.brownDark}; line-height: 1.2; }
    .front .row .ic { width: 13px; height: 13px; border-radius: 4px; background: ${C.pinkPale}; color: ${C.brown}; display: grid; place-items: center; }
    .front .row .ic svg { width: 7.5px; height: 7.5px; }
    .front .row small { display: block; font-size: 4.6px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${C.brownLight}; margin-bottom: .5px; }

    .back { background: linear-gradient(135deg, #fff6f8 0%, ${C.pinkPale} 55%, #f1e3d4 100%); display: grid; grid-template-columns: 1fr calc(128px + var(--b)); }
    .back::before { content: ''; position: absolute; left: -50px; bottom: -70px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle, rgba(248,200,212,.9), rgba(248,200,212,0) 70%); }
    .back .text { position: relative; padding: calc(18px + var(--b)) 10px calc(16px + var(--b)) calc(20px + var(--b)); display: flex; flex-direction: column; }
    .back .brandline { display: flex; align-items: center; gap: 6px; }
    .back .brandline .bn { font-family: 'Fraunces', serif; font-weight: 600; font-size: 8.5px; color: ${C.brownDark}; line-height: 1; }
    .back .brandline .bs { font-size: 4.4px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: ${C.pinkDeep}; margin-top: 1.5px; }
    .back .head { margin-top: 12px; font-family: 'Fraunces', serif; font-weight: 500; font-size: 15.5px; line-height: 1.05; color: ${C.brownDark}; letter-spacing: -.01em; }
    .back .head em { font-style: italic; color: ${C.pinkDeep}; }
    .back .lead { margin-top: 5px; font-size: 6.4px; line-height: 1.45; color: #7d6558; max-width: 160px; }
    .back .feat { margin-top: auto; display: grid; grid-template-columns: repeat(3, auto); gap: 5px; justify-content: start; }
    .back .feat span { display: inline-flex; align-items: center; gap: 3px; font-size: 5.2px; font-weight: 700; color: ${C.brown}; background: rgba(255,255,255,.75); padding: 3px 6px; border-radius: 99px; }
    .back .feat svg { width: 6.5px; height: 6.5px; }
    .back .url { margin-top: 7px; font-size: 7px; font-weight: 800; color: ${C.brown}; letter-spacing: .02em; }
    .back .qrwrap { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: calc(14px + var(--b)) calc(16px + var(--b)) calc(14px + var(--b)) 4px; }
    .back .qr { position: relative; width: 108px; height: 108px; background: #fff; border-radius: 14px; padding: 8px; box-shadow: 0 6px 18px rgba(59,37,24,.14); }
    .back .qr svg.code { width: 92px; height: 92px; display: block; }
    .back .qr .mark { position: absolute; left: 50%; top: 50%; width: 22px; height: 22px; transform: translate(-50%, -50%); background: #fff; border-radius: 50%; padding: 2px; }
    .back .qr .mark svg { width: 18px; height: 18px; display: block; }
    .back .scan { margin-top: 6px; font-size: 5.4px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: ${C.brownLight}; }
  </style></head><body>

  <div class="card front" id="front">
    <div class="panel">
      ${logo(58, C.pink, '#e98ca4', C.cream, C.pinkPale, C.brown, 'f')}
      <div class="clinic">${k.shortNameLines.map(esc).join('<br>')}</div>
      <div class="sub">${esc(k.subtitle)}</div>
      <div class="est">${esc(k.established)}</div>
    </div>
    <div class="body">
      <div class="name"><span class="dr">Dr.</span> ${esc(d.name)}<span class="dmd">${esc(d.designation)}</span></div>
      <div class="role">${esc(d.role)}</div>
      <div class="rule"></div>
      <div class="tag">${esc(k.tagline)} <em>${esc(k.taglineAccent)}</em></div>
      <div class="rows">
        <div class="row"><span class="ic">${icon.phone}</span><span><small>Call or text</small>${esc(ct.phone)}</span></div>
        <div class="row"><span class="ic">${icon.mail}</span><span><small>Email</small>${esc(ct.email)}</span></div>
        <div class="row"><span class="ic">${icon.pin}</span><span><small>Clinic</small>${esc(k.name)}, ${esc(k.address)}</span></div>
        <div class="row"><span class="ic">${icon.globe}</span><span><small>Website</small>${esc(cfg.siteLabel)}</span></div>
      </div>
    </div>
  </div>

  <div class="card back" id="back">
    <div class="text">
      <div class="brandline">${logo(16, C.brownMid, C.brown, '#fff2f5', C.pink, C.brown, 'b')}<div><div class="bn">${esc(k.shortName)}</div><div class="bs">${esc(k.subtitle)}</div></div></div>
      <div class="head">Your smile,<br>now <em>online</em>.</div>
      <div class="lead">Scan the code to book an appointment, browse our services and prices, and check today&rsquo;s clinic hours.</div>
      <div class="feat">
        <span>${icon.calendar} Book online</span>
        <span>${icon.tooth} Services</span>
        <span>${icon.clock} Live hours</span>
      </div>
      <div class="url">${esc(cfg.siteLabel)}</div>
    </div>
    <div class="qrwrap">
      <div class="qr">
        ${qrSvg.replace('<svg', '<svg class="code"')}
        <div class="mark">${logo(18, C.brownMid, C.brown, '#fff2f5', C.pink, C.brown, 'q')}</div>
      </div>
      <div class="scan">Scan to visit</div>
    </div>
  </div>
  </body></html>`;

  const htmlPath = path.join(OUT, `card${SUFFIX}.html`);
  fs.writeFileSync(htmlPath, html);

  const browser = await chromium.launch();
  // 600 DPI: 2100 px across 3.5 in → 6.25 device px per CSS px.
  const ctx = await browser.newContext({ viewport: { width: PW, height: PH * 2 }, deviceScaleFactor: 6.25 });
  const page = await ctx.newPage();
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  for (const side of ['front', 'back']) {
    const el = page.locator('#' + side);
    await el.screenshot({ path: path.join(OUT, `calling-card-${side}${SUFFIX}.png`) });
    await el.screenshot({ path: path.join(OUT, `calling-card-${side}${SUFFIX}.jpg`), type: 'jpeg', quality: 95 });
  }
  await page.pdf({
    path: path.join(OUT, `calling-card${SUFFIX}.pdf`),
    width: `${3.5 + (2 * B) / 96}in`, height: `${2 + (2 * B) / 96}in`,
    printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  if (B) {
    await page.addStyleTag({ content: `.card::after { content: ''; position: absolute; inset: ${B}px; border: 0.6px dashed rgba(217,111,140,.95); pointer-events: none; z-index: 9; }` });
    for (const side of ['front', 'back']) {
      await page.locator('#' + side).screenshot({ path: path.join(OUT, `calling-card-${side}-bleed-preview.png`) });
    }
  }
  await browser.close();

  // Prove the QR code scans to the right address.
  const { PNG } = require('pngjs');
  const jsQR = require('jsqr');
  const png = PNG.sync.read(fs.readFileSync(path.join(OUT, `calling-card-back${SUFFIX}.png`)));
  const res = jsQR(new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.length), png.width, png.height);
  if (!res || res.data !== cfg.siteUrl) {
    console.error('QR verification FAILED:', res ? res.data : 'no code found');
    process.exit(1);
  }
  console.log(`OK  ${png.width}x${png.height} px per side, QR → ${res.data}`);
  console.log(`Output: ${OUT}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
