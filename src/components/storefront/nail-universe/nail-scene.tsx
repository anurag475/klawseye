import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, Sparkles } from "@react-three/drei";
import gsap from "gsap";
import * as THREE from "three";
import { createBowGeometry, createHeartGeometry, createNailGeometry, createStarGeometry, surfaceFrame, type NailShape } from "./nail-geometry";
import { DESIGNS, charmPosition, createDesignMaterials, type DesignId } from "./nail-designs";
import { createColorResolver, readPalette, type Palette } from "./palette";

export type NailSceneProps = {
  compact: boolean;
  reducedMotion: boolean;
  active: boolean;
  burstRef: MutableRefObject<(() => void) | null>;
  onReady: () => void;
};

type V3 = [number, number, number];
type NailSlot = { design: DesignId; position: V3; rotation: V3; scale: number; compact?: V3 };

// Composition around a central hero nail; `compact` marks (and repositions) the mobile subset.
const NAILS: NailSlot[] = [
  { design: "pinkChrome", position: [0.05, 0.1, 1.3], rotation: [-0.18, 0.22, -0.42], scale: 1.18, compact: [0, 0, 1.2] },
  { design: "jelly", position: [-1.55, 1.15, -0.2], rotation: [-0.25, 0.42, 0.62], scale: 0.92, compact: [-1.35, 1.15, 0] },
  { design: "frenchPearl", position: [1.45, 1.3, 0.35], rotation: [-0.2, -0.38, -0.55], scale: 0.95, compact: [1.3, 1.2, 0.2] },
  { design: "statement", position: [-0.95, -1.35, 0.4], rotation: [-0.1, 0.35, 2.55], scale: 0.9, compact: [-1.05, -1.35, 0.3] },
  { design: "ginghamBow", position: [1.75, -0.35, -0.1], rotation: [-0.3, -0.5, -1.5], scale: 0.92, compact: [1.4, -0.45, 0] },
  { design: "glitter", position: [-1.9, -0.2, 0.55], rotation: [-0.15, 0.55, 1.45], scale: 0.86, compact: [-1.45, -0.15, 0.4] },
  { design: "milkyHearts", position: [0.95, -1.65, 0.75], rotation: [-0.35, -0.25, -2.6], scale: 0.86, compact: [0.95, -1.45, 0.6] },
  { design: "midnightStar", position: [0.05, 2.0, -1.25], rotation: [-0.42, 0.1, 0.08], scale: 0.9 },
  { design: "glazed", position: [-0.75, 0.95, -1.9], rotation: [-0.2, 0.3, 0.32], scale: 0.86 },
  { design: "aura", position: [0.9, 0.55, -2.1], rotation: [-0.25, -0.35, -0.3], scale: 0.86 },
  { design: "chromeFrench", position: [-0.2, -1.05, -2.2], rotation: [-0.4, 0.2, 3.0], scale: 0.86 },
];

type Floater = { kind: "pearl" | "star"; position: V3; size: number; tone?: "silver" | "pink"; compact?: boolean };
const FLOATERS: Floater[] = [
  { kind: "pearl", position: [-0.6, 0.45, 2.1], size: 0.11, compact: true },
  { kind: "pearl", position: [0.75, -0.7, 2.0], size: 0.08, compact: true },
  { kind: "pearl", position: [2.15, 0.85, -0.6], size: 0.1 },
  { kind: "pearl", position: [-2.15, 0.65, -1.2], size: 0.13 },
  { kind: "pearl", position: [0.2, -2.05, 0], size: 0.09, compact: true },
  { kind: "pearl", position: [1.65, 2.05, -1.6], size: 0.12 },
  { kind: "pearl", position: [-1.55, 2.05, -1.5], size: 0.08 },
  { kind: "star", position: [0.75, 1.45, 1.3], size: 0.17, tone: "silver", compact: true },
  { kind: "star", position: [-1.2, 0.25, 1.3], size: 0.12, tone: "pink", compact: true },
  { kind: "star", position: [2.2, -1.35, -0.7], size: 0.2, tone: "pink" },
  { kind: "star", position: [-2.0, -1.45, -0.9], size: 0.15, tone: "silver" },
];

const SHAPES: NailShape[] = ["almond", "coffin", "square", "oval", "stiletto"];
type Charm = { geometry: THREE.BufferGeometry; material: THREE.Material; position: THREE.Vector3; quaternion: THREE.Quaternion; scale: V3 };

function useNailAssets(compact: boolean) {
  const assets = useMemo(() => {
    const palette = readPalette();
    const color = createColorResolver();
    const geometries = Object.fromEntries(SHAPES.map(shape => [shape, createNailGeometry(shape, compact ? 0.7 : 1)])) as Record<NailShape, THREE.BufferGeometry>;
    const design = createDesignMaterials(palette, color, compact ? 512 : 1024);
    const charmGeometries = {
      pearl: new THREE.SphereGeometry(1, compact ? 20 : 32, compact ? 14 : 24),
      star: createStarGeometry(),
      heart: createHeartGeometry(),
      bow: createBowGeometry(),
    };
    const charms = Object.fromEntries(
      (Object.keys(DESIGNS) as DesignId[]).map(id => {
        const spec = DESIGNS[id];
        return [
          id,
          (spec.charms ?? []).map((charm): Charm => {
            const { x, y } = charmPosition(spec.shape, charm);
            const frame = surfaceFrame(geometries[spec.shape], x, y);
            const lift = charm.kind === "pearl" ? charm.size * 0.75 : charm.kind === "bow" ? 0.05 : charm.size * 0.32;
            const position = frame.point.clone().addScaledVector(frame.normal, lift);
            const quaternion = frame.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), charm.spin ?? 0));
            const material = charm.kind === "pearl" ? design.charmMaterials.pearl : design.charmMaterials[charm.tone ?? "silver"];
            const scale: V3 = charm.kind === "pearl" ? [charm.size, charm.size, charm.size * 0.92] : [charm.size, charm.size, charm.size];
            return { geometry: charmGeometries[charm.kind], material, position, quaternion, scale };
          }),
        ];
      }),
    ) as Record<DesignId, Charm[]>;
    // Hex versions of the brand tokens for Three props (Three can't parse oklch).
    const tone = Object.fromEntries(Object.entries(palette).map(([key, css]) => [key, `#${color(css).getHexString()}`])) as Palette;
    return {
      palette,
      tone,
      color,
      geometries,
      charmGeometries,
      charms,
      ...design,
      dispose() {
        Object.values(geometries).forEach(g => g.dispose());
        Object.values(charmGeometries).forEach(g => g.dispose());
        design.dispose();
      },
    };
  }, [compact]);
  useEffect(() => () => assets.dispose(), [assets]);
  return assets;
}

const damp = THREE.MathUtils.damp;

function Universe({ compact, reducedMotion, burstRef, onReady }: Omit<NailSceneProps, "active">) {
  const { camera, gl, scene, invalidate } = useThree();
  const assets = useNailAssets(compact);
  const slots = useMemo(
    () => NAILS.filter(n => !compact || n.compact).map((n, i) => {
      const position = new THREE.Vector3(...(compact && n.compact ? n.compact : n.position));
      return {
        ...n,
        base: position,
        spread: position.clone().setZ(0).normalize(),
        speed: 0.42 + ((i * 37) % 10) / 34,
        phase: i * 1.7,
        amp: 0.07 + ((i * 13) % 5) / 100,
      };
    }),
    [compact],
  );
  const floaters = useMemo(() => FLOATERS.filter(f => !compact || f.compact).map((f, i) => ({ ...f, base: new THREE.Vector3(...f.position), phase: i * 2.3 })), [compact]);
  const nailRefs = useRef<(THREE.Group | null)[]>([]);
  const floaterRefs = useRef<(THREE.Object3D | null)[]>([]);
  const root = useRef<THREE.Group>(null);
  const glint = useRef<THREE.PointLight>(null);
  const intro = useMemo(() => slots.map(() => ({ p: reducedMotion ? 1 : 0 })), [slots, reducedMotion]);
  const hover = useMemo(() => new Float32Array(slots.length), [slots]);
  const burst = useRef({ v: 0 });
  const pointer = useRef({ x: 0, y: 0, nx: 0, ny: 0, mouse: false });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    scene.environmentRotation.set(0, 0, 0);
    const ready = requestAnimationFrame(() => requestAnimationFrame(onReady));
    if (reducedMotion) {
      invalidate();
      return () => cancelAnimationFrame(ready);
    }
    const tl = gsap.timeline({ delay: 0.15 });
    tl.fromTo(camera.position, { z: 12.5 }, { z: 10, duration: 2.4, ease: "power3.out" }, 0);
    tl.to(intro, { p: 1, duration: 1.9, ease: "expo.out", stagger: 0.075 }, 0.05);
    return () => {
      cancelAnimationFrame(ready);
      tl.kill();
    };
  }, [camera, intro, invalidate, onReady, reducedMotion, scene]);

  useEffect(() => {
    if (reducedMotion) return;
    const pulse = burst.current;
    burstRef.current = () => {
      gsap.killTweensOf(pulse);
      gsap.timeline()
        .to(pulse, { v: 1, duration: 0.5, ease: "power2.out" })
        .to(pulse, { v: 0, duration: 1.8, ease: "power3.inOut" });
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      Object.assign(pointer.current, { nx, ny, x: THREE.MathUtils.clamp(nx, -1, 1), y: THREE.MathUtils.clamp(ny, -1, 1), mouse: true });
    };
    const leave = () => (pointer.current.mouse = false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      burstRef.current = null;
      gsap.killTweensOf(pulse);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [burstRef, gl, reducedMotion]);

  useFrame((state, delta) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const p = pointer.current;
    const b = burst.current.v;
    const aspect = state.size.width / Math.max(1, state.size.height);

    if (root.current && !reducedMotion) {
      // Mouse drives parallax; touch devices get a slow ambient sway plus a scroll tilt.
      const sx = p.mouse ? p.x : Math.sin(t * 0.21) * 0.45;
      const sy = p.mouse ? p.y : Math.cos(t * 0.17) * 0.3;
      const scroll = Math.min(window.scrollY, 700) / 700;
      root.current.rotation.y = damp(root.current.rotation.y, sx * 0.3, 2.2, dt);
      root.current.rotation.x = damp(root.current.rotation.x, -sy * 0.18 + scroll * 0.35, 2.2, dt);
      root.current.position.y = damp(root.current.position.y, scroll * 0.6, 3, dt);
      state.scene.environmentRotation.y = t * 0.12;
      if (glint.current) glint.current.position.set(Math.sin(t * 0.5) * 3.2, Math.cos(t * 0.35) * 2.2, 3.4);
    }

    slots.forEach((slot, i) => {
      const group = nailRefs.current[i];
      if (!group) return;
      const k = intro[i]?.p ?? 1;
      let near = 0;
      if (!reducedMotion && p.mouse) {
        group.getWorldPosition(tmp).project(camera);
        near = Math.hypot((tmp.x - p.nx) * aspect, tmp.y - p.ny) < 0.26 ? 1 : 0;
      }
      const h = (hover[i] = damp(hover[i] ?? 0, near, 5, dt));

      const bob = Math.sin(t * slot.speed + slot.phase) * slot.amp;
      const reach = 0.12 + 0.88 * k;
      group.position.set(
        slot.base.x * reach + slot.spread.x * b * 0.55,
        slot.base.y * reach + bob + slot.spread.y * b * 0.55,
        slot.base.z * reach - (1 - k) * 2 + h * 0.45 + b * 0.3,
      );
      const calm = 1 - h * 0.55;
      group.rotation.set(
        slot.rotation[0] * calm + Math.sin(t * 0.47 + slot.phase) * 0.09,
        slot.rotation[1] * calm + Math.cos(t * 0.39 + slot.phase) * 0.12 + (1 - k) * 1.8 + b * 0.9,
        slot.rotation[2] + Math.sin(t * 0.31 + slot.phase) * 0.06 + b * 0.25,
      );
      group.scale.setScalar(slot.scale * k * (1 + h * 0.07));
    });

    floaters.forEach((f, i) => {
      const o = floaterRefs.current[i];
      if (!o) return;
      const k = intro[Math.min(i, intro.length - 1)]?.p ?? 1;
      o.position.set(f.base.x * (1 + b * 0.25), f.base.y * (1 + b * 0.25) + Math.sin(t * 0.6 + f.phase) * 0.1, f.base.z);
      if (f.kind === "star") o.rotation.set(Math.sin(t * 0.5 + f.phase) * 0.35, Math.cos(t * 0.4 + f.phase) * 0.45, t * 0.15 + f.phase);
      else o.rotation.set(t * 0.2 + f.phase, t * 0.35 + f.phase, 0);
      o.scale.setScalar(f.size * k);
    });

    if (!reducedMotion) {
      const twinkle = 0.18 + Math.max(0, Math.sin(t * 2.3) * Math.sin(t * 1.3 + 1)) * 0.75;
      assets.materials.glitter.emissiveIntensity = twinkle;
      assets.materials.aura.emissiveIntensity = 0.12 + Math.max(0, Math.sin(t * 1.6 + 2)) * 0.5;
      assets.materials.pinkChrome.envMapIntensity = 1.4 + Math.sin(t * 0.8) * 0.25 + (hover[0] ?? 0) * 0.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color={assets.tone.cream} />
      <directionalLight position={[3, 5, 6]} intensity={1.7} color={assets.tone.cream} />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color={assets.tone.blush} />
      <pointLight ref={glint} position={[0, 0, 3.4]} intensity={reducedMotion ? 6 : 10} distance={9} color={assets.tone.pearl} />

      <Environment resolution={compact ? 128 : 256} frames={1}>
        <color attach="background" args={[assets.tone.gingham]} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[0, 5, 1]} scale={[10, 2.5, 1]} />
        <Lightformer form="rect" intensity={1} color={assets.tone.stage} position={[-3, -1, -5]} scale={[4, 10, 1]} />
        <Lightformer form="rect" intensity={1.4} color={assets.tone.cream} position={[3, -2, -5]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={2.4} color={assets.tone.blush} position={[-5, 1, 1]} scale={[2, 9, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#ffffff" position={[5, 0.5, 2]} scale={[1.4, 9, 1]} />
        <Lightformer form="ring" intensity={1.6} color={assets.tone.rose} position={[0, -3, 5]} scale={3} />
        <Lightformer form="rect" intensity={1.2} color={assets.tone.gold} position={[0, -5, -2]} scale={[8, 1, 1]} />
      </Environment>

      <group ref={root}>
        {slots.map((slot, i) => (
          <group key={slot.design} ref={el => { nailRefs.current[i] = el; }} scale={0}>
            <mesh geometry={assets.geometries[DESIGNS[slot.design].shape]} material={assets.materials[slot.design]} />
            {assets.charms[slot.design].map((charm, j) => (
              <mesh key={j} geometry={charm.geometry} material={charm.material} position={charm.position} quaternion={charm.quaternion} scale={charm.scale} />
            ))}
          </group>
        ))}

        {floaters.map((f, i) => (
          <mesh
            key={i}
            ref={el => { floaterRefs.current[i] = el; }}
            geometry={f.kind === "pearl" ? assets.charmGeometries.pearl : assets.charmGeometries.star}
            material={f.kind === "pearl" ? assets.charmMaterials.pearl : assets.charmMaterials[f.tone ?? "silver"]}
            scale={0}
          />
        ))}

        {!reducedMotion && <Sparkles count={compact ? 18 : 42} scale={[6, 5.5, 3]} size={compact ? 2.4 : 3.2} speed={0.22} noise={0.6} opacity={0.85} color={assets.tone.pearl} />}
      </group>
    </>
  );
}

function AdaptiveQuality() {
  const setDpr = useThree(state => state.setDpr);
  return <PerformanceMonitor onDecline={() => setDpr(1)} />;
}

export default function NailScene({ compact, reducedMotion, active, burstRef, onReady }: NailSceneProps) {
  const dpr = useRef<[number, number]>(compact ? [1, 1.5] : [1, 1.75]);
  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr.current}
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      camera={{ position: [0, 0, reducedMotion ? 10 : 12.5], fov: 30, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ pointerEvents: "none" }}
    >
      <AdaptiveQuality />
      <Universe compact={compact} reducedMotion={reducedMotion} burstRef={burstRef} onReady={onReady} />
    </Canvas>
  );
}
