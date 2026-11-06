import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

type Rgb = [number, number, number];

const css = readFileSync(path.resolve(import.meta.dirname, 'globals.css'), 'utf8');

const themeBlock = (selector: ':root' | '.dark') => {
  const start = css.indexOf(`${selector} {`);
  return css.slice(start, css.indexOf('\n  }', start));
};

const hsl = (block: string, token: string): Rgb => {
  const match = block.match(new RegExp(`--${token}:\\s*([\\d.]+) ([\\d.]+)% ([\\d.]+)%`));
  if (!match) throw new Error(`token ausente: ${token}`);
  const [h, s, l] = [Number(match[1]), Number(match[2]) / 100, Number(match[3]) / 100];
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  return [channel(0) * 255, channel(8) * 255, channel(4) * 255];
};

const blend = (top: Rgb, alpha: number, bottom: Rgb): Rgb =>
  top.map((value, index) => value * alpha + bottom[index]! * (1 - alpha)) as Rgb;

const luminance = (color: Rgb) => {
  const [r, g, b] = color.map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: Rgb, b: Rgb) => {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
};

const SLATE_600: Rgb = [71, 85, 105];
const SLATE_300: Rgb = [203, 213, 225];

describe.each([
  ['claro', ':root', SLATE_600],
  ['escuro', '.dark', SLATE_300],
] as const)('contraste no tema %s', (_name, selector, slate) => {
  const block = themeBlock(selector);
  const card = hsl(block, 'card');
  const tinted = blend(hsl(block, 'primary'), 0.1, card);

  it.each(['income-strong', 'expense-strong'])('%s passa em texto pequeno', (token) => {
    const text = hsl(block, token);

    expect(contrast(text, card)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(text, tinted)).toBeGreaterThanOrEqual(4.5);
  });

  it('o texto secundário do bloco de Saldo Livre passa sobre bg-primary/10', () => {
    expect(contrast(slate, tinted)).toBeGreaterThanOrEqual(4.5);
  });
});
