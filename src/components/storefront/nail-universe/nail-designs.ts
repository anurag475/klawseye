import * as THREE from "three";
import { NAIL_SHAPES, type NailShape } from "./nail-geometry";
import type { Palette, PaletteKey } from "./palette";

export type CharmKind = "pearl" | "bow" | "star" | "heart";
/** u: -1..1 across the nail, v: -1 (cuticle) .. 1 (tip) */
export type Charm = { kind: CharmKind; u: number; v: number; size: number; spin?: number; tone?: "silver" | "pink" | "navy" };

export type DesignId =
  | "pinkChrome"
  | "jelly"
  | "frenchPearl"
  | "glitter"
  | "ginghamBow"
  | "midnightStar"
  | "statement"
  | "milkyHearts"
  | "glazed"
  | "aura"
  | "chromeFrench";

export type DesignSpec = { shape: NailShape; charms?: Charm[]; twinkle?: boolean };

export const DESIGNS: Record<DesignId, DesignSpec> = {
  pinkChrome: { shape: "almond", charms: [{ kind: "star", u: 0.12, v: 0.42, size: 0.11, tone: "silver", spin: 0.3 }, { kind: "pearl", u: -0.25, v: -0.45, size: 0.06 }] },
  jelly: { shape: "coffin" },
  frenchPearl: { shape: "square", charms: [{ kind: "pearl", u: -0.36, v: -0.5, size: 0.062 }, { kind: "pearl", u: 0, v: -0.56, size: 0.08 }, { kind: "pearl", u: 0.36, v: -0.5, size: 0.062 }] },
  glitter: { shape: "almond", twinkle: true },
  ginghamBow: { shape: "square", charms: [{ kind: "bow", u: 0, v: -0.38, size: 0.74, tone: "navy" }] },
  midnightStar: { shape: "stiletto", charms: [{ kind: "star", u: 0, v: 0.12, size: 0.13, tone: "silver" }, { kind: "star", u: 0.28, v: -0.38, size: 0.08, tone: "silver", spin: 0.5 }] },
  statement: { shape: "coffin", charms: [{ kind: "heart", u: 0, v: 0.1, size: 0.13, tone: "pink" }] },
  milkyHearts: { shape: "oval" },
  glazed: { shape: "almond", charms: [{ kind: "pearl", u: 0, v: -0.52, size: 0.07 }] },
  aura: { shape: "oval", twinkle: true },
  chromeFrench: { shape: "coffin", charms: [{ kind: "bow", u: 0, v: -0.45, size: 0.6, tone: "pink" }] },
};

export function charmPosition(shape: NailShape, charm: Charm) {
  const s = NAIL_SHAPES[shape];
  return { x: charm.u * (s.width / 2) * (1 - s.taper * Math.max(0, charm.v) * 0.8), y: charm.v * (s.length / 2) };
}

type Ctx = CanvasRenderingContext2D;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function heart(ctx: Ctx, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.42);
  ctx.bezierCurveTo(x - s * 0.62, y, x - s * 0.5, y - s * 0.5, x, y - s * 0.22);
  ctx.bezierCurveTo(x + s * 0.5, y - s * 0.5, x + s * 0.62, y, x, y + s * 0.42);
  ctx.fill();
}

function sparkle(ctx: Ctx, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** Builds the nail materials. Canvas top = free edge (tip). */
export function createDesignMaterials(palette: Palette, color: (css: string) => THREE.Color, height: number) {
  const width = height / 2;
  const textures: THREE.Texture[] = [];
  const c = (key: PaletteKey) => color(palette[key]);

  const paint = (draw: (ctx: Ctx, w: number, h: number) => void, srgb = true) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    draw(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.anisotropy = 4;
    textures.push(texture);
    return texture;
  };

  const frenchTip = (ctx: Ctx, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(-2, -2);
    ctx.lineTo(w + 2, -2);
    ctx.lineTo(w + 2, h * 0.36);
    ctx.quadraticCurveTo(w / 2, h * 0.08, -2, h * 0.36);
    ctx.closePath();
    ctx.fill();
  };

  const glitterSpecks = (ctx: Ctx, w: number, h: number, mono: boolean, seed: number, count: number) => {
    const rand = rng(seed);
    const tones = [palette.pearl, palette.gold, palette.silver, palette.hot];
    for (let i = 0; i < count; i++) {
      const y = h * rand() ** 1.7;
      const x = rand() * w;
      const r = (0.6 + rand() * 1.8) * (h / 512);
      ctx.fillStyle = mono ? "#fff" : tones[Math.floor(rand() * tones.length)] ?? palette.pearl;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const glossy = (params: THREE.MeshPhysicalMaterialParameters) =>
    new THREE.MeshPhysicalMaterial({ roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.1, ...params });

  const materials: Record<DesignId, THREE.MeshPhysicalMaterial> = {
    pinkChrome: glossy({ color: c("chrome"), metalness: 1, roughness: 0.1, envMapIntensity: 1.5 }),

    jelly: glossy({
      color: c("jelly"),
      roughness: 0.05,
      transparent: true,
      opacity: 0.74,
      sheen: 0.7,
      sheenColor: c("blush"),
      iridescence: 0.25,
      emissive: c("jelly"),
      emissiveIntensity: 0.12,
      envMapIntensity: 1.5,
      map: paint((ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, palette.hot);
        g.addColorStop(1, palette.blush);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }),
    }),

    frenchPearl: glossy({
      roughness: 0.18,
      map: paint((ctx, w, h) => {
        ctx.fillStyle = palette.nude;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = palette.pearl;
        frenchTip(ctx, w, h);
      }),
    }),

    glitter: (() => {
      const specks = paint((ctx, w, h) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        glitterSpecks(ctx, w, h, true, 7, 2600);
      }, false);
      return glossy({
        metalness: 1,
        roughness: 0.3,
        metalnessMap: specks,
        emissive: new THREE.Color("#ffffff"),
        emissiveMap: specks,
        emissiveIntensity: 0.3,
        map: paint((ctx, w, h) => {
          const g = ctx.createLinearGradient(0, 0, 0, h);
          g.addColorStop(0, palette.rose);
          g.addColorStop(0.55, palette.chrome);
          g.addColorStop(1, palette.blush);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
          glitterSpecks(ctx, w, h, false, 7, 2600);
        }),
      });
    })(),

    ginghamBow: glossy({
      roughness: 0.22,
      map: paint((ctx, w, h) => {
        ctx.fillStyle = palette.cream;
        ctx.fillRect(0, 0, w, h);
        const band = w / 5;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = palette.rose;
        for (let x = 0; x < w; x += band * 2) ctx.fillRect(x, 0, band, h);
        for (let y = 0; y < h; y += band * 2) ctx.fillRect(0, y, w, band);
        ctx.globalAlpha = 1;
      }),
    }),

    midnightStar: glossy({
      roughness: 0.14,
      map: paint((ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, palette.ink);
        g.addColorStop(1, palette.navy);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        const rand = rng(21);
        ctx.fillStyle = palette.pearl;
        for (let i = 0; i < 26; i++) sparkle(ctx, rand() * w, rand() * h, (2 + rand() * 7) * (h / 512));
      }),
    }),

    statement: glossy({
      roughness: 0.16,
      map: paint((ctx, w, h) => {
        ctx.fillStyle = palette.ink;
        ctx.fillRect(0, 0, w, h);
        ctx.lineCap = "round";
        ctx.strokeStyle = palette.hot;
        ctx.lineWidth = w * 0.13;
        for (let i = 0; i < 3; i++) {
          const x = w * (0.15 + i * 0.35);
          ctx.beginPath();
          ctx.moveTo(x, h * 1.05);
          ctx.bezierCurveTo(x + w * 0.45, h * 0.75, x - w * 0.45, h * 0.5, x + w * 0.12, h * 0.18);
          ctx.stroke();
        }
        ctx.strokeStyle = palette.blush;
        ctx.lineWidth = w * 0.025;
        for (let i = 0; i < 3; i++) {
          const x = w * (0.15 + i * 0.35) + w * 0.09;
          ctx.beginPath();
          ctx.moveTo(x, h * 1.05);
          ctx.bezierCurveTo(x + w * 0.45, h * 0.75, x - w * 0.45, h * 0.5, x + w * 0.12, h * 0.18);
          ctx.stroke();
        }
        const cell = w / 8;
        for (let x = 0; x < 8; x++) for (let y = 0; y < 2; y++) {
          ctx.fillStyle = (x + y) % 2 ? palette.ink : palette.hot;
          ctx.fillRect(x * cell, h * 0.86 + y * cell, cell, cell);
        }
      }),
    }),

    milkyHearts: glossy({
      roughness: 0.2,
      sheen: 0.4,
      sheenColor: c("blush"),
      map: paint((ctx, w, h) => {
        ctx.fillStyle = palette.milk;
        ctx.fillRect(0, 0, w, h);
        const spots: [number, number, number][] = [[0.3, 0.2, 0.2], [0.72, 0.36, 0.15], [0.36, 0.52, 0.24], [0.7, 0.7, 0.17], [0.32, 0.84, 0.14]];
        spots.forEach(([x, y, s], i) => {
          ctx.fillStyle = i % 2 ? palette.hot : palette.rose;
          heart(ctx, x * w, y * h, s * w);
        });
      }),
    }),

    glazed: glossy({ color: c("pearl"), metalness: 0.35, roughness: 0.16, iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 560], sheen: 0.4, sheenColor: c("blush") }),

    aura: glossy({
      roughness: 0.24,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0.25,
      emissiveMap: paint((ctx, w, h) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        const rand = rng(5);
        ctx.fillStyle = "#fff";
        for (let i = 0; i < 9; i++) sparkle(ctx, rand() * w, h * (0.15 + rand() * 0.6), (3 + rand() * 6) * (h / 512));
      }),
      map: paint((ctx, w, h) => {
        ctx.fillStyle = palette.nude;
        ctx.fillRect(0, 0, w, h);
        const g = ctx.createRadialGradient(w / 2, h * 0.52, 0, w / 2, h * 0.52, w * 0.62);
        g.addColorStop(0, palette.hot);
        g.addColorStop(0.45, palette.rose);
        g.addColorStop(1, palette.nude);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        const rand = rng(5);
        ctx.fillStyle = palette.pearl;
        for (let i = 0; i < 9; i++) sparkle(ctx, rand() * w, h * (0.15 + rand() * 0.6), (3 + rand() * 6) * (h / 512));
      }),
    }),

    chromeFrench: glossy({
      roughness: 0.14,
      metalness: 1,
      metalnessMap: paint((ctx, w, h) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff";
        frenchTip(ctx, w, h);
      }, false),
      map: paint((ctx, w, h) => {
        ctx.fillStyle = palette.milk;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = palette.chrome;
        frenchTip(ctx, w, h);
      }),
    }),
  };

  const charmMaterials = {
    pearl: new THREE.MeshPhysicalMaterial({ color: c("pearl"), roughness: 0.22, metalness: 0.08, clearcoat: 1, sheen: 1, sheenColor: c("blush"), iridescence: 0.7, iridescenceIOR: 1.4 }),
    silver: new THREE.MeshPhysicalMaterial({ color: c("silver"), metalness: 1, roughness: 0.08, envMapIntensity: 1.6 }),
    pink: new THREE.MeshPhysicalMaterial({ color: c("chrome"), metalness: 1, roughness: 0.1, envMapIntensity: 1.6 }),
    navy: new THREE.MeshPhysicalMaterial({ color: c("navy"), roughness: 0.38, sheen: 1, sheenColor: c("blush"), clearcoat: 0.4 }),
  };

  return {
    materials,
    charmMaterials,
    dispose() {
      textures.forEach(texture => texture.dispose());
      Object.values(materials).forEach(material => material.dispose());
      Object.values(charmMaterials).forEach(material => material.dispose());
    },
  };
}
