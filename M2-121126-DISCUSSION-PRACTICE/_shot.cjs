// Screenshot one slide from a Chromium run that has confirmed Reveal is ready.
// Usage: node _probe-shots.cjs <file-url> <outdir> <slide-indices comma-separated>
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const [url, outDir, list] = process.argv.slice(2);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 });
  fs.mkdirSync(outDir, { recursive: true });
  for (const n of list.split(',').map((s) => parseInt(s.trim(), 10))) {
    await page.evaluate((i) => Reveal.slide(i - 1, 0), n);
    await new Promise((r) => setTimeout(r, 900));
    const file = path.join(outDir, String(n).padStart(2, '0') + '.png');
    await page.screenshot({ path: file });
    console.log('shot', n, '->', path.basename(file));
  }
  await browser.close();
})();
