const fs = require('fs');
const html = fs.readFileSync('scripts/nobrecar_index.html', 'utf8');

// 1. Textures
console.log('=== SEARCHING TEXTURES ===');
const textureMatches = [...html.matchAll(/(Circuito|Fluxo|Pedra)[^<]*/gi)];
console.log('Matches:', textureMatches.map(m => m[0]));

const textBlockIdx = html.indexOf('TEXTURA');
if (textBlockIdx !== -1) {
  console.log('TEXTURE BLOCK:');
  console.log(html.substring(textBlockIdx - 100, textBlockIdx + 2500));
}

// 2. FAQ
console.log('=== SEARCHING FAQ ===');
const qIdx = html.indexOf('O tapete é realmente sob medida');
if (qIdx !== -1) {
  console.log('FAQ BLOCK:');
  console.log(html.substring(qIdx - 150, qIdx + 4500));
}

// 3. Checkout / Buy button
console.log('=== SEARCHING CHECKOUT / COMPRAR ===');
const buyMatches = [...html.matchAll(/class="[^"]*comprar[^"]*"[\s\S]*?<\/button>/gi)];
console.log('Buy buttons:', buyMatches.map(m => m[0]));
const cartOrCheckout = [...html.matchAll(/href="[^"]*(checkout|cart|pagamento)[^"]*"/gi)];
console.log('Links to checkout/cart:', cartOrCheckout.map(m => m[0]));

// Let's also search for how clicking the buy button works in scripts-v2.js
const scripts = fs.readFileSync('scripts/nobrecar_dados.js', 'utf8');
const checkoutInScript = [...scripts.matchAll(/(checkout|finalizar|comprar|redirect|stripe|hotmart|kiwify|mercado|cart)/gi)];
console.log('Script matches count:', checkoutInScript.length);
