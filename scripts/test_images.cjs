const http = require('http');

const images = [
  'favicon.svg',
  'logo.png',
  'ambiente-onix.webp',
  'interior-instalado.webp',
  'llavero.webp',
  'detalle-cobertura.webp',
  'antes-frente.webp',
  'despues-frente.webp',
  'antes-trasero.webp',
  'despues-trasero.webp',
  'ojal-fijacion.webp',
  'det-material.webp',
  'det-borde.webp',
  'det-ojal.webp',
  'empresa.png',
  'detalle-puerta.webp',
  'ambiente-frente.webp',
  'kit-full-negro.webp',
  'kit-full-gris.webp',
  'kit-full-beige.webp',
  'kit-interior-negro.webp',
  'kit-interior-gris.webp',
  'kit-interior-beige.webp',
  'rev-delantero.webp',
  'rev-piso.webp',
  'rev-pickup.webp',
  'rev-baul.webp',
  'rev-trasero.webp',
  'rev-suv.webp',
  'rev-asiento.webp'
];

async function checkImages() {
  let errors = 0;
  for (const img of images) {
    await new Promise((resolve) => {
      http.get(`http://localhost:3000/assets/img/${img}`, (res) => {
        if (res.statusCode !== 200) {
          console.error(`FAIL: ${img} returned ${res.statusCode}`);
          errors++;
        }
        resolve();
      }).on('error', (err) => {
        console.error(`ERROR: ${img} - ${err.message}`);
        errors++;
        resolve();
      });
    });
  }
  if (errors === 0) {
    console.log(`ALL ${images.length} IMAGES VERIFIED: 100% OK (HTTP 200)`);
  } else {
    console.log(`Found ${errors} image errors`);
  }
}

checkImages();
