import { Color, SRGBColorSpace } from "three";

// Scene colours come from the semantic tokens in src/styles.css so the WebGL
// art direction stays in sync with the rest of the storefront.
const TOKENS = {
  navy: ["--primary", "#3d5a80"],
  cream: ["--background", "#fdf6f3"],
  blush: ["--brand-blush", "#f6d5d7"],
  gingham: ["--brand-gingham", "#e2a5a8"],
  rose: ["--brand-rose", "#ec7d96"],
  chrome: ["--nail-chrome", "#f5a9c4"],
  jelly: ["--nail-jelly", "#ff7fa8"],
  nude: ["--nail-nude", "#efc9b4"],
  milk: ["--nail-milk", "#fbe7ea"],
  ink: ["--nail-ink", "#1d1b26"],
  hot: ["--nail-hot", "#f0388a"],
  pearl: ["--nail-pearl", "#fbf5ef"],
  silver: ["--nail-silver", "#d9dde6"],
  gold: ["--nail-gold", "#f1d27e"],
  stage: ["--nail-stage", "#2a3550"],
} as const;

export type PaletteKey = keyof typeof TOKENS;
export type Palette = Record<PaletteKey, string>;

export function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const probe = document.createElement("canvas").getContext("2d");
  const entries = Object.entries(TOKENS).map(([key, [token, fallback]]) => {
    const value = styles.getPropertyValue(token).trim();
    return [key, value && canPaint(probe, value) ? value : fallback];
  });
  return Object.fromEntries(entries) as Palette;
}

function canPaint(ctx: CanvasRenderingContext2D | null, value: string) {
  if (!ctx) return false;
  ctx.fillStyle = "#010203";
  ctx.fillStyle = value;
  return ctx.fillStyle !== "#010203";
}

// Resolves any CSS colour (including oklch) to an sRGB THREE.Color via a 1px canvas.
export function createColorResolver() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const cache = new Map<string, Color>();
  return (css: string) => {
    const cached = cache.get(css);
    if (cached) return cached.clone();
    const color = new Color();
    if (ctx) {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
      color.setRGB(r / 255, g / 255, b / 255, SRGBColorSpace);
    }
    cache.set(css, color);
    return color.clone();
  };
}
