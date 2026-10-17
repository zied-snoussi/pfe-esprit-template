// Converts the skeleton diagrams to full Excalidraw scenes, writes Obsidian
// .excalidraw.md files and PNG exports. Usage: node render.js <outDir> [name]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const diagrams = require('./diagrams');

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
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome') });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.ExcalidrawLib && window.ExcalidrawLib.exportToBlob);
  fs.mkdirSync(path.join(OUT, 'excalidraw'), { recursive: true });

  for (const [name, build] of Object.entries(diagrams)) {
    if (only && name !== only) continue;
    const skeleton = build();
    const { elements, png } = await page.evaluate(async (sk) => {
      const L = window.ExcalidrawLib;
      await document.fonts.ready;
      const elements = L.convertToExcalidrawElements(sk, { regenerateIds: false });
      const blob = await L.exportToBlob({
        elements, files: null, mimeType: 'image/png', exportPadding: 30,
        appState: { exportBackground: true, viewBackgroundColor: '#ffffff', exportWithDarkMode: false },
        getDimensions: (w, h) => ({ width: w * 2, height: h * 2, scale: 2 }),
      });
      const png = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result.split(',')[1]); fr.readAsDataURL(blob); });
      return { elements, png };
    }, skeleton);
    fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(png, 'base64'));
    fs.writeFileSync(path.join(OUT, 'excalidraw', `${name}.excalidraw.md`), toMarkdown(elements));
    console.log('ok', name, elements.length, 'elements');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
