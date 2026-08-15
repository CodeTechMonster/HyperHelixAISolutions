import { chromium } from 'playwright'
const names = ['human','time','collaboration','growth','trust','files','document','presentation','contract','workflow','brain','automation','shield','transform','network','spark']
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await page.evaluate((names) => {
  document.body.innerHTML = '<div id="grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding:32px;background:#fff"></div>'
  const grid = document.getElementById('grid')
  const src = document.querySelectorAll('svg')
  grid.innerHTML = names.map(n => `<div style="text-align:center"><div class="slot" data-n="${n}" style="height:96px"></div><div style="font:12px sans-serif;color:#334155">${n}</div></div>`).join('')
  void src
}, names)
await browser.close()
console.log('placeholder')
