/**
 * Genera los iconos de la app (icon, adaptive icons de Android, favicon, splash)
 * a partir de un diseño SVG: carrito de la compra con productos en los colores
 * de acento de las tiendas, sobre el gradiente oscuro de la app.
 *
 * Uso: node scripts/generate-icons.js
 */
const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Carrito con productos (dibujado centrado en un viewBox de 1024)
function cartGroup({ stroke = '#ffffff', mono = false } = {}) {
  const cyan = mono ? stroke : '#22d3ee';
  const orange = mono ? stroke : '#f97316';
  const green = mono ? stroke : '#4ade80';
  return `
    <g stroke-linecap="round" stroke-linejoin="round">
      <!-- Productos dentro del carrito -->
      <circle cx="420" cy="400" r="52" fill="${cyan}" />
      <circle cx="530" cy="380" r="52" fill="${orange}" />
      <circle cx="630" cy="405" r="52" fill="${green}" />

      <!-- Asa -->
      <path d="M255 300 L340 320 L385 560 L660 560 L706 380 L360 380"
        fill="none" stroke="${stroke}" stroke-width="34" />

      <!-- Cesta -->
      <path d="M340 320 L385 560" fill="none" stroke="${stroke}" stroke-width="34" />

      <!-- Patas -->
      <path d="M400 560 L385 640 M645 560 L660 640" fill="none" stroke="${stroke}" stroke-width="30" />

      <!-- Ruedas -->
      <circle cx="430" cy="690" r="38" fill="none" stroke="${stroke}" stroke-width="26" />
      <circle cx="620" cy="690" r="38" fill="none" stroke="${stroke}" stroke-width="26" />
    </g>`;
}

const gradientDefs = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a0533" />
      <stop offset="0.5" stop-color="#130a2e" />
      <stop offset="1" stop-color="#0d0a3a" />
    </linearGradient>
    <radialGradient id="orb" cx="0.75" cy="0.2" r="0.6">
      <stop offset="0" stop-color="#a855f7" stop-opacity="0.35" />
      <stop offset="1" stop-color="#a855f7" stop-opacity="0" />
    </radialGradient>
  </defs>`;

// Icono principal (fondo + carrito)
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <rect width="1024" height="1024" fill="url(#bg)" />
  <rect width="1024" height="1024" fill="url(#orb)" />
  ${cartGroup()}
</svg>`;

// Foreground adaptativo: solo el carrito (Android recorta ~66% central)
const foregroundSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(512 512) scale(0.62) translate(-512 -512)">
    ${cartGroup()}
  </g>
</svg>`;

// Background adaptativo: solo el gradiente
const backgroundSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${gradientDefs}
  <rect width="1024" height="1024" fill="url(#bg)" />
  <rect width="1024" height="1024" fill="url(#orb)" />
</svg>`;

// Monocromo: silueta blanca del carrito
const monochromeSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(512 512) scale(0.62) translate(-512 -512)">
    ${cartGroup({ mono: true })}
  </g>
</svg>`;

// Splash: carrito centrado más pequeño sobre transparente
const splashSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(512 512) scale(0.5) translate(-512 -512)">
    ${cartGroup()}
  </g>
</svg>`;

async function render(svg, file, size) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(path.join(ASSETS, file));
  console.log(`✓ ${file} (${size}x${size})`);
}

(async () => {
  await render(iconSvg, 'icon.png', 1024);
  await render(foregroundSvg, 'android-icon-foreground.png', 1024);
  await render(backgroundSvg, 'android-icon-background.png', 1024);
  await render(monochromeSvg, 'android-icon-monochrome.png', 1024);
  await render(splashSvg, 'splash-icon.png', 1024);
  await render(iconSvg, 'favicon.png', 48);
  console.log('Iconos generados en /assets');
})();
