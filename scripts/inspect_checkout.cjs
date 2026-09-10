const fs = require('fs');
const scripts = fs.readFileSync('scripts/nobrecar_dados.js', 'utf8');

const btnIdx = scripts.indexOf('rvConfirmBtn');
if (btnIdx !== -1) {
  console.log('rvConfirmBtn found in scripts-v2.js:');
  console.log(scripts.substring(btnIdx - 200, btnIdx + 1500));
} else {
  console.log('rvConfirmBtn not found in scripts-v2.js, checking index.html');
  const html = fs.readFileSync('scripts/nobrecar_index.html', 'utf8');
  const idx2 = html.indexOf('rvConfirmBtn');
  console.log(html.substring(idx2 - 200, idx2 + 1500));
}

// Let's also check modal confirmation or checkout redirect
const modalIdx = scripts.indexOf('rvModal');
if (modalIdx !== -1) {
  console.log('rvModal found:');
  console.log(scripts.substring(modalIdx - 100, modalIdx + 1200));
}
