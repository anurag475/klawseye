import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type NailShape = "almond" | "coffin" | "square" | "oval" | "stiletto";

type ShapeSpec = {
  length: number;
  width: number;
  thickness: number;
  /** 0 = parallel sides, 1 = sides meet at the free edge */
  taper: number;
  /** superellipse exponent near the free edge (< 1 squares it off) */
  tipPow: number;
  basePow: number;
  /** transverse C-curve depth */
  curve: number;
  /** longitudinal arch depth */
  arch: number;
};

export const NAIL_SHAPES: Record<NailShape, ShapeSpec> = {
  almond: { length: 1.72, width: 0.8, thickness: 0.16, taper: 0.6, tipPow: 0.95, basePow: 0.62, curve: 0.13, arch: 0.08 },
  coffin: { length: 1.9, width: 0.8, thickness: 0.16, taper: 0.36, tipPow: 0.3, basePow: 0.62, curve: 0.13, arch: 0.09 },
  square: { length: 1.42, width: 0.84, thickness: 0.17, taper: 0.05, tipPow: 0.38, basePow: 0.62, curve: 0.14, arch: 0.06 },
  oval: { length: 1.5, width: 0.82, thickness: 0.17, taper: 0.16, tipPow: 0.85, basePow: 0.62, curve: 0.14, arch: 0.07 },
  stiletto: { length: 2.08, width: 0.78, thickness: 0.15, taper: 0.9, tipPow: 1.05, basePow: 0.62, curve: 0.12, arch: 0.1 },
};

const smoothstep = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const spow = (v: number, p: number) => Math.sign(v) * Math.abs(v) ** p;

/**
 * A press-on nail shell: a dense sphere reshaped into a superellipsoid,
 * tapered towards the free edge, then given a C-curve and longitudinal arch.
 * Length runs along +Y (tip), the glossy top faces +Z.
 */
export function createNailGeometry(shape: NailShape, detail = 1) {
  const s = NAIL_SHAPES[shape];
  const sphere = new THREE.SphereGeometry(1, Math.round(72 * detail), Math.round(56 * detail));
  sphere.deleteAttribute("normal");
  sphere.deleteAttribute("uv");
  const geometry = mergeVertices(sphere);
  sphere.dispose();

  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const uv = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const nx = position.getX(i);
    const ny = position.getY(i);
    const nz = position.getZ(i);
    const p = THREE.MathUtils.lerp(s.basePow, s.tipPow, smoothstep(-0.1, 0.7, ny));
    const px = spow(nx, p);
    const py = spow(ny, p);
    const pz = spow(nz, 0.5);

    const halfWidth = (s.width / 2) * (1 - s.taper * smoothstep(-0.05, 1.05, py) ** 1.3);
    const x = px * halfWidth;
    const y = py * (s.length / 2);
    const thickness = (s.thickness / 2) * (1 - 0.45 * Math.max(0, py) ** 2) * (pz < 0 ? 0.45 : 1);
    const z = pz * thickness - s.curve * px * px - s.arch * (py - 0.1) ** 2;

    position.setXYZ(i, x, y, z);
    uv[i * 2] = x / s.width + 0.5;
    uv[i * 2 + 1] = py * 0.5 + 0.5;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

/** Finds a point and normal on the top surface for placing charms. */
export function surfaceFrame(geometry: THREE.BufferGeometry, x: number, y: number) {
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  const raycaster = new THREE.Raycaster(new THREE.Vector3(x, y, 5), new THREE.Vector3(0, 0, -1));
  const hit = raycaster.intersectObject(mesh)[0];
  material.dispose();
  const point = hit?.point ?? new THREE.Vector3(x, y, 0.08);
  const normal = (hit?.normal ?? hit?.face?.normal ?? new THREE.Vector3(0, 0, 1)).clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
  return { point, normal, quaternion };
}

export function createStarGeometry(points = 5, inner = 0.46) {
  const shape = new THREE.Shape();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 ? inner : 1;
    const a = (i / (points * 2)) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.12,
    bevelSegments: 4,
    curveSegments: 1,
  });
  geometry.center();
  return geometry;
}

export function createHeartGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, -0.9);
  shape.bezierCurveTo(-0.35, -0.55, -1, -0.2, -1, 0.25);
  shape.bezierCurveTo(-1, 0.75, -0.45, 0.95, 0, 0.55);
  shape.bezierCurveTo(0.45, 0.95, 1, 0.75, 1, 0.25);
  shape.bezierCurveTo(1, -0.2, 0.35, -0.55, 0, -0.9);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.14,
    bevelSegments: 5,
    curveSegments: 14,
  });
  geometry.center();
  return geometry;
}

/** Puffy satin bow: two lobes, a knot and two tails merged into one draw call. */
export function createBowGeometry() {
  const ellipsoid = (sx: number, sy: number, sz: number) => {
    const g = new THREE.SphereGeometry(1, 28, 18);
    g.scale(sx, sy, sz);
    return g;
  };
  const lobe = (x: number, rz: number) => ellipsoid(0.27, 0.16, 0.09).rotateZ(rz).translate(x, 0.02, 0);
  const tail = (rz: number) => ellipsoid(0.055, 0.2, 0.04).translate(0, -0.2, -0.01).rotateZ(rz);
  const knot = ellipsoid(0.08, 0.09, 0.075).translate(0, 0, 0.05);
  const parts = [lobe(-0.21, -0.32), lobe(0.21, 0.32), tail(-0.45), tail(0.45), knot];
  const geometry = mergeGeometries(parts) ?? new THREE.SphereGeometry(0.2);
  parts.forEach(part => part.dispose());
  return geometry;
}
