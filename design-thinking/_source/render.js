// Converts the skeleton diagrams (index.js) to Excalidraw scenes: writes <out>/<name>.excalidraw.md (Obsidian)
// and <out>/png/<name>.png (+ copy in rapport/figures/design-thinking/). Usage: node render.js <outDir> [name]
//   CHROME         Chrome/Chromium executable (default: usual path per OS)
//   PLAYWRIGHT     path to playwright or playwright-core (default: 'playwright-core')
//   LOCAL_MODULES  node_modules folder with @excalidraw/excalidraw@0.17.6, react@18.2.0, react-dom@18.2.0
//                  (offline: unpkg.com requests are served from there)
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright-core');
const diagrams = require('./index');

const OUT = process.argv[2];
const only = process.argv[3];
const V = '0.17.6';
const html = `<!doctype html><html><head><meta charset="utf-8">
<script>window.EXCALIDRAW_ASSET_PATH = "https://unpkg.com/@excalidraw/excalidraw@${V}/dist/";</script>
<script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@excalidraw/excalidraw@${V}/dist/excalidraw.production.min.js"></script>
</head><body></body></html>`;

function toMarkdown(elements) {
  const texts = elements.filter((e) => e.type === 'text').map((e) => `${e.text} ^${e.id}\n`).join('\n');
  const scene = {
    type: 'excalidraw', version: 2, source: 'https://github.com/zsviczian/obsidian-excalidraw-plugin',
    elements, appState: { gridSize: null, viewBackgroundColor: '#ffffff' }, files: {},
  };
  return `---\n\nexcalidraw-plugin: parsed\ntags: [excalidraw]\n\n---\n==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==\n\n\n# Excalidraw Data\n\n## Text Elements\n${texts}\n%%\n## Drawing\n\`\`\`json\n${JSON.stringify(scene, null, '\t')}\n\`\`\`\n%%`;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome') });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  if (process.env.LOCAL_MODULES) {
    await page.route('https://unpkg.com/**', (route) => {
      const m = new URL(route.request().url()).pathname.match(/^\/((?:@[^/]+\/)?[^@/]+)@[^/]+\/(.*)$/);
      const file = m && path.join(process.env.LOCAL_MODULES, m[1], m[2]);
      if (file && fs.existsSync(file)) return route.fulfill({ path: file });
      return route.fulfill({ status: 404, body: '' });
    });
  }
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ExcalidrawLib && window.ExcalidrawLib.exportToBlob);
  // warm-up export so the hand-drawn and normal fonts are loaded before the first real diagram
  await page.evaluate(async () => {
    const L = window.ExcalidrawLib;
    const els = L.convertToExcalidrawElements([{ type: 'text', x: 0, y: 0, text: 'Aa', fontFamily: 1 }, { type: 'text', x: 0, y: 40, text: 'Aa', fontFamily: 2 }]);
    await L.exportToBlob({ elements: els, files: null, mimeType: 'image/png' });
    await document.fonts.ready;
  });
  fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });
  const REPORT = path.resolve(__dirname, '..', '..', 'rapport', 'figures', 'design-thinking');
  fs.mkdirSync(REPORT, { recursive: true });

  for (const [name, build] of Object.entries(diagrams)) {
    if (only && name !== only) continue;
    const skeleton = build();
    const { elements, png } = await page.evaluate(async ([sk, SC]) => {
      const L = window.ExcalidrawLib;
      await document.fonts.ready;
      const elements = L.convertToExcalidrawElements(sk, { regenerateIds: false });
      const blob = await L.exportToBlob({
        elements, files: null, mimeType: 'image/png', exportPadding: 30,
        appState: { exportBackground: true, viewBackgroundColor: '#ffffff', exportWithDarkMode: false },
        getDimensions: (w, h) => ({ width: w * SC, height: h * SC, scale: SC }),
      });
      const png = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result.split(',')[1]); fr.readAsDataURL(blob); });
      return { elements, png };
    }, [skeleton, Number(process.env.SCALE || 2)]);
    fs.writeFileSync(path.join(OUT, 'png', `${name}.png`), Buffer.from(png, 'base64'));
    fs.writeFileSync(path.join(OUT, `${name}.excalidraw.md`), toMarkdown(elements));
    fs.copyFileSync(path.join(OUT, 'png', `${name}.png`), path.join(REPORT, `${name}.png`));
    console.log('ok', name, elements.length, 'elements');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
