const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const testUrl = async (url) => {
    console.log(`Testing ${url}...`);
    const res = await page.goto(url, { waitUntil: 'networkidle2' });
    console.log(`Status: ${res.status()}`);
    if (res.status() !== 200) {
      console.error(`Failed to load ${url}`);
    }
  };

  try {
    await testUrl('http://localhost:3000/en/dashboard');
    await testUrl('http://localhost:3000/en/settings');
    await testUrl('http://localhost:3000/de/dashboard');
    console.log('All tests passed.');
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await browser.close();
  }
})();
