/**
 * Generates the push-notification assets referenced by the backend payload
 * (`icon` / `badge` — ver .specs/features/front-handoff-transaction-push.md).
 *
 * - public/icons/income.png   192px, full-bleed --income  + TrendingUp
 * - public/icons/expense.png  192px, full-bleed --expense + TrendingDown
 * - public/icons/badge.png     96px, glyph branco em fundo transparente
 *
 * O badge do Android é re-renderizado como máscara monocromática: só o canal
 * alpha sobrevive, por isso ele é silhueta branca sem fundo.
 *
 * Cores vindas do design system (globals.css): --income 142 76% 36%,
 * --expense 0 72% 51%.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INCOME = 'hsl(142, 76%, 36%)';
const EXPENSE = 'hsl(0, 72%, 51%)';

// Glyphs do lucide-react (24-unit), os mesmos usados na UI para entrada/saída.
const TRENDING_UP = `
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>`;

const TRENDING_DOWN = `
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 6"/>
    <polyline points="16 17 22 17 22 11"/>`;

// DollarSign da marca, em stroke grosso — legível no tamanho do badge.
const DOLLAR = `
    <line x1="12" y1="3" x2="12" y2="21"/>
    <path d="M17 6H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7"/>`;

/** Centraliza um glyph de 24 unidades ocupando 55% de um canvas 512. */
const glyph = (body, strokeWidth) => `
  <g transform="translate(115.2 115.2) scale(11.7333)" fill="none" stroke="#ffffff"
     stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}
  </g>`;

const wrap = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${body}</svg>`;

const filled = (color, body) =>
  wrap(`<rect width="512" height="512" fill="${color}"/>${glyph(body, 2.4)}`);

const targets = [
  { svg: filled(INCOME, TRENDING_UP), size: 192, out: '../public/icons/income.png' },
  { svg: filled(EXPENSE, TRENDING_DOWN), size: 192, out: '../public/icons/expense.png' },
  { svg: wrap(glyph(DOLLAR, 3.6)), size: 96, out: '../public/icons/badge.png' },
];

async function run() {
  fs.mkdirSync(path.join(__dirname, '../public/icons'), { recursive: true });

  for (const { svg, size, out } of targets) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, out));
    console.log(`✅ ${out} (${size}x${size})`);
  }

  console.log('🎉 Notification icons generated');
}

run().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
