// Renders every ../*.drawio file to ../png/<name>.png with the official draw.io viewer
// (client-side rendering in headless Chrome). Usage: node render.js [name-filter]
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const DIR = path.resolve(__dirname, '..');
const OUT = path.join(DIR, 'png');
const REPORT = path.resolve(DIR, '..', 'rapport', 'figures', 'uml'); // copie utilisée par le rapport LaTeX
const filter = process.argv[2] || '';
const CHROME = process.env.CHROME || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(REPORT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 2400, height: 1600 } });
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.setContent('<html><body style="margin:0;background:#fff"><div id="c"></div>'
    + '<script src="https://viewer.diagrams.net/js/viewer-static.min.js"></script></body></html>', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.GraphViewer);
  for (const f of fs.readdirSync(DIR).filter((n) => n.endsWith('.drawio') && n.includes(filter))) {
    const xml = fs.readFileSync(path.join(DIR, f), 'utf8');
    await page.evaluate((xml) => {
      const c = document.getElementById('c');
      c.innerHTML = '';
      const div = document.createElement('div');
      div.className = 'mxgraph';
      div.style.display = 'inline-block';
      div.style.padding = '24px';
      div.setAttribute('data-mxgraph', JSON.stringify({ xml, toolbar: '', nav: false, resize: true, border: 0 }));
      c.appendChild(div);
      window.GraphViewer.processElements();
    }, xml);
    await page.waitForSelector('#c svg');
    await page.waitForTimeout(400);
    const out = path.join(OUT, f.replace('.drawio', '.png'));
    const box = await page.locator('#c svg').boundingBox();
    const m = 16;
    await page.setViewportSize({ width: Math.ceil(box.x + box.width + 2 * m), height: Math.ceil(box.y + box.height + 2 * m) });
    const b = await page.locator('#c svg').boundingBox();
    await page.screenshot({ path: out, clip: { x: Math.max(0, b.x - m), y: Math.max(0, b.y - m), width: b.width + 2 * m, height: b.height + 2 * m } });
    fs.copyFileSync(out, path.join(REPORT, path.basename(out)));
    console.log('rendered', path.basename(out));
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
