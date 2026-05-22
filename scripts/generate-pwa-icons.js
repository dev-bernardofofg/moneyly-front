/**
 * Generates every raster icon asset from the Moneyly design-system mark.
 * Single source of truth: the SVG below mirrors public/logo-moneyly.svg
 * (gradient 135deg primary -> -12% L, glyph 55%, radius 17.2%).
 *
 * - rounded master  -> src/app/icon.png, public/logo-moneyly.png
 * - full-bleed mask  -> public/icon-192x192.png, public/icon-512x512.png
 *   (manifest purpose "maskable any": no radius, glyph inside 80% safe zone)
 * - favicon.ico      -> src/app/favicon.ico (16/32/48, PNG-in-ICO frames;
 *   16 px uses the simplified thick-stroke glyph per design-system spec)
 *
 * ICO is hand-encoded (PNG payload) so no extra dependency is needed —
 * modern browsers accept PNG-compressed ICO entries.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const path = require('path');

const GRAD = `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(127, 44%, 68%)"/>
      <stop offset="1" stop-color="hsl(127, 44%, 56%)"/>
    </linearGradient>
  </defs>`;

// Canonical glyph (>= 32 px): 24-unit DollarSign, stroke 2.4, 55% box.
const GLYPH = `
  <g transform="translate(115.2 115.2) scale(11.7333)" fill="none" stroke="#ffffff"
     stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </g>`;

// Simplified glyph (<= 24 px): thicker stroke 3.6, fewer anchor points.
const GLYPH_SMALL = `
  <g transform="translate(115.2 115.2) scale(11.7333)" fill="none" stroke="#ffffff"
     stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="3" x2="12" y2="21"/>
    <path d="M17 6H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7"/>
  </g>`;

const wrap = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${GRAD}${body}</svg>`;

const rounded = wrap(`<rect width="512" height="512" rx="88" ry="88" fill="url(#g)"/>${GLYPH}`);
const maskable = wrap(`<rect width="512" height="512" fill="url(#g)"/>${GLYPH}`);
const faviconBig = rounded;
const faviconSmall = wrap(
  `<rect width="512" height="512" rx="88" ry="88" fill="url(#g)"/>${GLYPH_SMALL}`
);

const targets = [
  { svg: rounded, size: 512, out: '../src/app/icon.png' },
  { svg: rounded, size: 120, out: '../public/logo-moneyly.png' },
  { svg: maskable, size: 192, out: '../public/icon-192x192.png' },
  { svg: maskable, size: 512, out: '../public/icon-512x512.png' },
];

/** Assemble a multi-size .ico from PNG buffers (PNG-in-ICO). */
function buildIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const dir = Buffer.alloc(count * 16);
  let offset = 6 + count * 16;
  const ordered = [];

  images.forEach((img, i) => {
    const e = i * 16;
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, e + 0);
    dir.writeUInt8(img.size >= 256 ? 0 : img.size, e + 1);
    dir.writeUInt8(0, e + 2); // palette
    dir.writeUInt8(0, e + 3); // reserved
    dir.writeUInt16LE(1, e + 4); // color planes
    dir.writeUInt16LE(32, e + 6); // bits per pixel
    dir.writeUInt32LE(img.data.length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += img.data.length;
    ordered.push(img.data);
  });

  return Buffer.concat([header, dir, ...ordered]);
}

async function run() {
  for (const { svg, size, out } of targets) {
    const outputPath = path.join(__dirname, out);
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outputPath);
    console.log(`✅ ${out} (${size}x${size})`);
  }

  const icoSizes = [
    { size: 16, svg: faviconSmall },
    { size: 32, svg: faviconBig },
    { size: 48, svg: faviconBig },
  ];
  const frames = [];
  for (const { size, svg } of icoSizes) {
    const data = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
    frames.push({ size, data });
  }
  const icoPath = path.join(__dirname, '../src/app/favicon.ico');
  require('fs').writeFileSync(icoPath, buildIco(frames));
  console.log('✅ ../src/app/favicon.ico (16/32/48)');

  console.log('🎉 Icon assets generated from design-system mark');
}

run().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
