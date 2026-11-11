// Verify a deck after the browser editor saved the live DOM back to disk.
const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2];
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => window.Reveal && window.Reveal.isReady(), { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 1200));

  const state = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('.reveal .slides > section')];
    const seconds = () => new Promise((r) => setTimeout(r, 400));
    return {
      total: Reveal.getTotalSlides(),
      sectionCount: sections.length,
      present: sections.filter((s) => s.classList.contains('present')).length,
      shownByDisplay: sections.filter((s) => getComputedStyle(s).display !== 'none').length,
      stillHiddenAttr: sections.filter((s) => s.hasAttribute('hidden')).length,
      stillInert: sections.filter((s) => s.hasAttribute('inert')).length,
      inlineDisplayNone: sections.filter((s) => s.style.display === 'none').length,
      slidesTransform: document.querySelector('.reveal .slides').style.transform,
      controlsBlocks: document.querySelectorAll('aside.controls').length,
      progressBlocks: document.querySelectorAll('.progress').length,
      firstSlideId: Reveal.getCurrentSlide() ? Reveal.getCurrentSlide().id : null,
      firstSlideVisible: (() => {
        const s = document.getElementById('cover');
        const r = s.getBoundingClientRect();
        return getComputedStyle(s).display !== 'none' && r.width > 100 && r.height > 100;
      })(),
    };
  });
  console.log(JSON.stringify(state, null, 2));

  // Can we still navigate to the last slide and see it?
  await page.evaluate(() => Reveal.slide(21, 0));
  await new Promise((r) => setTimeout(r, 700));
  const last = await page.evaluate(() => {
    const s = Reveal.getCurrentSlide();
    const r = s.getBoundingClientRect();
    return { id: s.id, display: getComputedStyle(s).display, w: Math.round(r.width), h: Math.round(r.height) };
  });
  console.log('LAST SLIDE:', JSON.stringify(last));
  await browser.close();
})();
