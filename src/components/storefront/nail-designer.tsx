import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowRight, Check, Dices, Send, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  charmGroups,
  charmLabel,
  charmOptions,
  charmsArePreview,
  shadeFamilies,
  shadeLabel,
  shades,
  shadesArePreview,
  type CharmOption,
  type ShadeFamily,
} from "./design-options";
import {
  charmFor,
  charmNail,
  charmOf,
  describeDesign,
  finishes,
  fingerNames,
  initialDesign,
  lengths,
  looks,
  paintNail,
  placements,
  randomDesign,
  resetNail,
  shadeIdFor,
  shadeOf,
  shapes,
  tipColours,
  type Design,
  type Shape,
} from "./nail-design";

// Thumb to pinky: relative width and how far each nail is fanned out.
const fingers = [
  { width: 1.25, tilt: -9, x: 56, drop: 34 },
  { width: 1, tilt: -4, x: 152, drop: 8 },
  { width: 1.06, tilt: 0, x: 248, drop: 0 },
  { width: 0.96, tilt: 4, x: 342, drop: 10 },
  { width: 0.8, tilt: 9, x: 428, drop: 30 },
];

type Point = readonly [number, number];
type Half = readonly [Point, Point, Point, Point, Point, Point];

// Right half of the free edge, from the side wall up to the centre of the tip, as two cubic curves.
// Every shape uses the same command structure so the outline can morph between them.
function rightHalf(shape: Shape, w: number, h: number): { top: number; seg: Half } {
  const line = (a: Point, b: Point): [Point, Point, Point] => [
    [a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3],
    [a[0] + (2 * (b[0] - a[0])) / 3, a[1] + (2 * (b[1] - a[1])) / 3],
    b,
  ];
  const mid: Point = [w / 2, 0];
  switch (shape) {
    case "square": {
      const t = w * 0.16;
      return {
        top: t,
        seg: [[w, t * 0.4], [w * 0.97, 0], [w * 0.84, 0], ...line([w * 0.84, 0], mid)],
      };
    }
    case "oval": {
      const t = w * 0.5;
      return { top: t, seg: [[w, t * 0.45], [w * 0.78, 0], mid, mid, mid, mid] };
    }
    case "almond": {
      const t = h * 0.44;
      return { top: t, seg: [[w, t * 0.42], [w * 0.68, 0], mid, mid, mid, mid] };
    }
    case "stiletto": {
      const t = h * 0.58;
      return { top: t, seg: [[w, t * 0.45], [w * 0.56, h * 0.05], mid, mid, mid, mid] };
    }
    case "coffin": {
      const t = h * 0.42;
      const corner: Point = [w * 0.79, 0];
      return { top: t, seg: [...line([w, t], corner), ...line(corner, mid)] };
    }
  }
}

function nailPath(shape: Shape, w: number, h: number) {
  const r = w * 0.34;
  const base = h - r;
  const { top, seg } = rightHalf(shape, w, h);
  const p = (pt: Point) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
  const mirror = (pt: Point): Point => [w - pt[0], pt[1]];
  const [a1, b1, e1, a2, b2] = seg;
  const left: Point[] = [mirror(b2), mirror(a2), mirror(e1), mirror(b1), mirror(a1), [0, top]];
  return {
    top,
    d: `M0 ${base.toFixed(1)} A${(w / 2).toFixed(1)} ${r.toFixed(1)} 0 0 0 ${w.toFixed(1)} ${base.toFixed(1)} L${w.toFixed(1)} ${top.toFixed(1)} C${p(a1)} ${p(b1)} ${p(e1)} C${p(a2)} ${p(b2)} ${p([w / 2, 0])} C${p(left[0]!)} ${p(left[1]!)} ${p(left[2]!)} C${p(left[3]!)} ${p(left[4]!)} ${p(left[5]!)} Z`,
  };
}

function CharmArt({ charm, w, h }: { charm: CharmOption; w: number; h: number }) {
  const cx = w / 2;
  const cy = h * 0.66;
  const s = w * 0.26;
  if (charm.image)
    return (
      <image
        href={charm.image}
        x={cx - s * 1.5}
        y={cy - s * 1.5}
        width={s * 3}
        height={s * 3}
        preserveAspectRatio="xMidYMid meet"
      />
    );
  switch (charm.art) {
    case "pearls":
      return (
        <g>
          {[
            [-0.9, 0.4],
            [0, -0.3],
            [0.9, 0.4],
          ].map(([dx, dy], i) => (
            <circle
              key={i}
              cx={cx + dx! * s}
              cy={cy + dy! * s}
              r={s * 0.5}
              fill="url(#nd-pearl)"
              stroke="oklch(0.6 0.02 60 / 40%)"
              strokeWidth=".6"
            />
          ))}
        </g>
      );
    case "cross":
      return (
        <path
          d={`M${cx - s * 0.28} ${cy - s * 1.25} H${cx + s * 0.28} V${cy - s * 0.5} H${cx + s * 0.85} V${cy + s * 0.05} H${cx + s * 0.28} V${cy + s * 1.35} H${cx - s * 0.28} V${cy + s * 0.05} H${cx - s * 0.85} V${cy - s * 0.5} H${cx - s * 0.28}Z`}
          fill="url(#nd-metal)"
          stroke="oklch(0.5 0.03 80 / 50%)"
          strokeWidth=".6"
        />
      );
    case "star":
      return (
        <path
          d={
            Array.from({ length: 10 }, (_, i) => {
              const a = (Math.PI / 5) * i - Math.PI / 2;
              const rr = i % 2 ? s * 0.5 : s * 1.15;
              return `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
            }).join(" ") + "Z"
          }
          fill="url(#nd-metal)"
          stroke="oklch(0.5 0.03 80 / 50%)"
          strokeWidth=".6"
        />
      );
    case "heart":
      return (
        <path
          d={`M${cx} ${cy + s * 0.95} C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.7} ${cy - s * 1.2} ${cx} ${cy - s * 0.35} C${cx + s * 0.7} ${cy - s * 1.2} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.95}Z`}
          fill="var(--nail-cherry)"
          stroke="oklch(1 0 0 / 60%)"
          strokeWidth="1"
        />
      );
    case "bow":
      return (
        <g fill="var(--nail-pearl)" stroke="oklch(0.5 0.03 20 / 45%)" strokeWidth=".7">
          <path
            d={`M${cx} ${cy} L${cx - s * 1.3} ${cy - s * 0.7} L${cx - s * 1.2} ${cy + s * 0.75}Z M${cx} ${cy} L${cx + s * 1.3} ${cy - s * 0.7} L${cx + s * 1.2} ${cy + s * 0.75}Z M${cx - s * 0.2} ${cy + s * 0.2} L${cx - s * 0.6} ${cy + s * 1.4} M${cx + s * 0.2} ${cy + s * 0.2} L${cx + s * 0.6} ${cy + s * 1.4}`}
          />
          <circle cx={cx} cy={cy} r={s * 0.32} />
        </g>
      );
    case "cherry":
      return (
        <g>
          <path
            d={`M${cx - s * 0.55} ${cy + s * 0.2} Q${cx - s * 0.2} ${cy - s} ${cx + s * 0.3} ${cy - s * 1.2} M${cx + s * 0.55} ${cy + s * 0.35} Q${cx + s * 0.4} ${cy - s * 0.6} ${cx + s * 0.3} ${cy - s * 1.2}`}
            fill="none"
            stroke="var(--nail-sage)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx={cx - s * 0.55} cy={cy + s * 0.5} r={s * 0.5} fill="var(--nail-cherry)" />
          <circle cx={cx + s * 0.55} cy={cy + s * 0.65} r={s * 0.5} fill="var(--nail-cherry)" />
        </g>
      );
    case "flower":
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={cx + Math.cos(a) * s * 0.62}
                cy={cy + Math.sin(a) * s * 0.62}
                r={s * 0.48}
                fill="var(--nail-pearl)"
                stroke="oklch(0.6 0.03 20 / 35%)"
                strokeWidth=".6"
              />
            );
          })}
          <circle cx={cx} cy={cy} r={s * 0.34} fill="var(--nail-gold)" />
        </g>
      );
    default:
      return null;
  }
}

function NailTray({
  design,
  spin,
  selected = null,
  onSelect,
}: {
  design: Design;
  spin: number;
  selected?: number | null;
  onSelect?: (index: number) => void;
}) {
  const uid = useId().replace(/:/g, "");
  const scale = lengths[design.length]!.scale;
  return (
    <svg
      className="nail-tray-art"
      data-focus={selected !== null || undefined}
      viewBox="0 0 520 360"
      role="img"
      aria-label={`Preview: ${describeDesign(design).split("\n").slice(1).join(", ").replace(/• /g, "")}`}
    >
      <defs>
        <radialGradient id="nd-pearl" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="white" />
          <stop offset=".55" stopColor="var(--nail-pearl)" />
          <stop offset="1" stopColor="var(--nail-silver)" />
        </radialGradient>
        <linearGradient id="nd-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" />
          <stop offset=".45" stopColor="var(--nail-gold)" />
          <stop offset="1" stopColor="oklch(0.62 0.1 80)" />
        </linearGradient>
        <linearGradient id={`${uid}-chrome`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="black" stopOpacity=".35" />
          <stop offset=".22" stopColor="white" stopOpacity=".85" />
          <stop offset=".4" stopColor="white" stopOpacity="0" />
          <stop offset=".62" stopColor="black" stopOpacity=".18" />
          <stop offset=".8" stopColor="white" stopOpacity=".6" />
          <stop offset="1" stopColor="black" stopOpacity=".3" />
        </linearGradient>
        <linearGradient id={`${uid}-depth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity=".18" />
          <stop offset=".7" stopColor="black" stopOpacity="0" />
          <stop offset="1" stopColor="black" stopOpacity=".16" />
        </linearGradient>
        <linearGradient id={`${uid}-cateye`} x1="0" y1="1" x2="1" y2="0">
          <stop offset=".15" stopColor="black" stopOpacity=".4" />
          <stop offset=".45" stopColor="white" stopOpacity=".1" />
          <stop offset=".55" stopColor="white" stopOpacity=".8" />
          <stop offset=".65" stopColor="white" stopOpacity=".1" />
          <stop offset=".9" stopColor="black" stopOpacity=".4" />
        </linearGradient>
        <pattern id={`${uid}-glitter`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="white" opacity=".9" />
          <circle cx="6.5" cy="5" r=".8" fill="var(--nail-gold)" />
          <circle cx="3.5" cy="7.5" r=".6" fill="white" opacity=".7" />
        </pattern>
        <filter id={`${uid}-shadow`} x="-30%" y="-20%" width="160%" height="150%">
          <feDropShadow
            dx="3"
            dy="6"
            stdDeviation="4"
            floodColor="oklch(0.35 0.04 30)"
            floodOpacity=".35"
          />
        </filter>
      </defs>
      {fingers.map((finger, i) => {
        const w = 70 * finger.width;
        const h = (150 + 30 * finger.width) * scale;
        const { d, top } = nailPath(design.shape, w, h);
        const shade = shadeOf(shadeIdFor(design, i));
        const colour = shade.colour;
        // Cat-eye and jelly shades carry their own look; the chosen finish applies to solid colours.
        const finish = shade.family === "solid" ? design.finish : shade.family;
        const charm = charmFor(design, i);
        const clip = `${uid}-clip-${i}`;
        const x = finger.x - w / 2 + 18;
        const y = 345 - h - finger.drop;
        return (
          <g
            key={`${i}-${spin}`}
            className="nail-tray-nail"
            style={{ "--delay": `${i * 70}ms` } as CSSProperties}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${finger.tilt} ${w / 2} ${h})`}
          >
            <g
              className="nail-tray-hit"
              data-selected={selected === i || undefined}
              data-clickable={onSelect ? true : undefined}
              onClick={onSelect ? () => onSelect(i) : undefined}
            >
              <clipPath id={clip}>
                <path style={{ d: `path("${d}")` } as CSSProperties} d={d} />
              </clipPath>
              <g filter={`url(#${uid}-shadow)`}>
                <path
                  className="nail-shape"
                  style={{ d: `path("${d}")` } as CSSProperties}
                  d={d}
                  fill={finish === "jelly" ? "var(--nail-nude)" : colour}
                />
              </g>
              <g clipPath={`url(#${clip})`}>
                {finish === "jelly" && <rect width={w} height={h} fill={colour} opacity=".72" />}
                {finish === "chrome" && <rect width={w} height={h} fill={`url(#${uid}-chrome)`} />}
                {finish === "catEye" && <rect width={w} height={h} fill={`url(#${uid}-cateye)`} />}
                {finish === "glitter" && (
                  <rect width={w} height={h} fill={`url(#${uid}-glitter)`} />
                )}
                {design.french && (
                  <ellipse
                    className="nail-tip"
                    cx={w / 2}
                    cy={-h * 0.04}
                    rx={w * 0.78}
                    ry={Math.max(top * 0.82, h * 0.2)}
                    fill={design.tip}
                  />
                )}
                {design.french && finish === "chrome" && (
                  <ellipse
                    cx={w / 2}
                    cy={-h * 0.04}
                    rx={w * 0.78}
                    ry={Math.max(top * 0.82, h * 0.2)}
                    fill={`url(#${uid}-chrome)`}
                    opacity=".7"
                  />
                )}
                <rect width={w} height={h} fill={`url(#${uid}-depth)`} />
                {finish !== "matte" && (
                  <ellipse
                    className="nail-gloss"
                    cx={w * 0.28}
                    cy={h * 0.55}
                    rx={w * 0.08}
                    ry={h * 0.26}
                    fill="white"
                    opacity={finish === "jelly" ? 0.6 : 0.42}
                  />
                )}
                {finish !== "matte" && (
                  <ellipse
                    className="nail-gloss"
                    cx={w * 0.62}
                    cy={h * 0.18}
                    rx={w * 0.12}
                    ry={h * 0.05}
                    fill="white"
                    opacity=".3"
                  />
                )}
                {charm && (
                  <g className="nail-charm">
                    <CharmArt charm={charm} w={w} h={h} />
                  </g>
                )}
              </g>
              <path
                style={{ d: `path("${d}")` } as CSSProperties}
                d={d}
                fill="none"
                stroke="oklch(0.3 0.03 20 / 18%)"
                strokeWidth="1"
              />
              {selected === i && (
                <path
                  className="nail-selected"
                  style={{ d: `path("${d}")` } as CSSProperties}
                  d={d}
                  fill="none"
                />
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export { NailTray };

function Chip({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      className="designer-chip"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

const steps = [
  { id: "shape", label: "Shape", value: (d: Design) => d.shape },
  { id: "length", label: "Length", value: (d: Design) => lengths[d.length]!.label },
  {
    id: "shades",
    label: "Shades",
    value: (d: Design) => `${new Set(fingers.map((_, i) => shadeIdFor(d, i))).size} picked`,
  },
  { id: "finish", label: "Finish", value: (d: Design) => d.finish },
  {
    id: "tips",
    label: "Tips",
    value: (d: Design) =>
      d.french ? (tipColours.find((tip) => tip.value === d.tip)?.name ?? "On") : "None",
  },
  {
    id: "charms",
    label: "Charms",
    value: (d: Design) => (d.charms.length ? `${d.charms.length} picked` : "None"),
  },
];
const shadesStep = 2;
const paintableSteps = [shadesStep, 5];

/** Interactive press-on designer: build a set, paint single nails, and send it as a custom request. */
export function NailDesigner({
  look,
  onUseDesign,
}: {
  look?: { id: string; count: number };
  onUseDesign: (design: Design) => void;
}) {
  const [design, setDesign] = useState<Design>(initialDesign);
  const [history, setHistory] = useState<Design[]>([]);
  const [spin, setSpin] = useState(0);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [family, setFamily] = useState<ShadeFamily>("solid");
  const [charmGroup, setCharmGroup] = useState("All");
  const tray = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const commit = (next: Design) => {
    setHistory((past) => [...past, design].slice(-30));
    setDesign(next);
  };
  const set = (patch: Partial<Design>) => commit({ ...design, ...patch });
  const dealt = (next: Design) => {
    commit(next);
    setSpin((s) => s + 1);
    setSelected(null);
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setDesign(previous);
    setHistory(history.slice(0, -1));
  };
  const toggleShade = (id: string) => {
    if (selected !== null) return commit(paintNail(design, selected, id));
    set({
      shades: design.shades.includes(id)
        ? design.shades.length > 1
          ? design.shades.filter((value) => value !== id)
          : design.shades
        : [...design.shades, id].slice(-3),
    });
  };
  const toggleCharm = (id: string) => {
    if (selected !== null) return commit(charmNail(design, selected, id));
    set({
      charms: design.charms.includes(id)
        ? design.charms.filter((value) => value !== id)
        : [...design.charms, id].slice(-3),
    });
  };
  const selectNail = (index: number) => {
    setSelected((current) => (current === index ? null : index));
    if (!paintableSteps.includes(step)) setStep(shadesStep);
  };

  // A look tapped on the corkboard above lands here.
  const lastLook = useRef(0);
  useEffect(() => {
    if (!look || look.count === lastLook.current) return;
    lastLook.current = look.count;
    const chosen = looks.find((item) => item.id === look.id);
    if (chosen) dealt(chosen.design);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only a newly tapped look should deal a set
  }, [look]);

  // The set tilts towards the pointer and its gloss slides, like turning a real hand under a light.
  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const box = event.currentTarget.getBoundingClientRect();
    const tx = ((event.clientX - box.left) / box.width) * 2 - 1;
    const ty = ((event.clientY - box.top) / box.height) * 2 - 1;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      tray.current?.style.setProperty("--tx", tx.toFixed(3));
      tray.current?.style.setProperty("--ty", ty.toFixed(3));
    });
  };
  const untilt = () => {
    cancelAnimationFrame(frame.current);
    tray.current?.style.setProperty("--tx", "0");
    tray.current?.style.setProperty("--ty", "0");
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const nailName = selected === null ? null : fingerNames[selected]!;
  const painted = selected !== null && Boolean(design.overrides[selected]);
  const shadeActive = (id: string) =>
    selected === null ? design.shades.includes(id) : shadeIdFor(design, selected) === id;
  const charmActive = (id: string) =>
    selected === null ? design.charms.includes(id) : charmFor(design, selected)?.id === id;

  return (
    <section className="nail-designer" id="designer" data-purpose="nail-designer">
      <div className="designer-wrap">
        <div className="designer-intro">
          <span className="designer-kicker">{"PLAY BEFORE YOU ORDER"}</span>
          <h2 className="designer-title">
            {"DESIGN YOUR "}
            <span className="hero-scribble">{"KLAWS"}</span>
          </h2>
          <p className="designer-lede">
            {
              "Mix shapes, shades, finishes and charms, watch your set come to life, then send it straight to the studio."
            }
          </p>
        </div>

        <div className="designer-layout">
          <div className="designer-stage">
            <div className="nail-tray" ref={tray} onPointerMove={tilt} onPointerLeave={untilt}>
              <span aria-hidden="true" className="nail-tray-label font-handwritten">
                {"your set ✦ handmade to order"}
              </span>
              <NailTray design={design} spin={spin} selected={selected} onSelect={selectNail} />
            </div>
            <div className="designer-fingers" role="group" aria-label="Choose which nails to paint">
              <button
                type="button"
                className="designer-finger"
                aria-pressed={selected === null}
                onClick={() => setSelected(null)}
              >
                {"All"}
              </button>
              {fingerNames.map((name, i) => (
                <button
                  type="button"
                  key={name}
                  className="designer-finger"
                  aria-pressed={selected === i}
                  data-painted={design.overrides[i] ? true : undefined}
                  onClick={() => selectNail(i)}
                >
                  <span
                    aria-hidden="true"
                    className="designer-finger-dot"
                    style={{ background: shadeOf(shadeIdFor(design, i)).colour }}
                  />
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="designer-controls">
            <div className="designer-looks">
              <p className="designer-looks-title font-handwritten">{"Start from a look"}</p>
              <div className="designer-looks-row">
                {looks.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="designer-look"
                    onClick={() => dealt(item.design)}
                  >
                    <span aria-hidden="true" className="designer-look-nails">
                      {item.design.shades.map((id) => (
                        <span key={id} style={{ background: shadeOf(id).colour }} />
                      ))}
                    </span>
                    <strong>{item.name}</strong>
                    <small>{item.line}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="designer-panel">
              <nav
                aria-label="Design steps"
                className="designer-steps"
                style={{ "--progress": `${(step / (steps.length - 1)) * 100}%` } as CSSProperties}
              >
                {steps.map((item, i) => (
                  <button
                    type="button"
                    key={item.id}
                    className="designer-step"
                    aria-current={step === i ? "step" : undefined}
                    data-done={i < step || undefined}
                    onClick={() => setStep(i)}
                  >
                    <span aria-hidden="true" className="designer-step-nail">
                      {i < step ? <Check /> : i + 1}
                    </span>
                    <span className="designer-step-label">{item.label}</span>
                    <span className="designer-step-value">{item.value(design)}</span>
                  </button>
                ))}
              </nav>

              {paintableSteps.includes(step) && (
                <p className="designer-target" role="status">
                  {nailName ? (
                    <>
                      <strong>{`Painting the ${nailName.toLowerCase()} nail only.`}</strong>
                      {painted && (
                        <button type="button" onClick={() => commit(resetNail(design, selected!))}>
                          {"Match the set again"}
                        </button>
                      )}
                    </>
                  ) : (
                    "Painting the whole set. Tap a nail to paint it on its own."
                  )}
                </p>
              )}

              <div className="designer-step-panel" key={step}>
                {step === 0 && (
                  <fieldset>
                    <legend>{"Shape"}</legend>
                    <div className="designer-row">
                      {shapes.map((shape) => (
                        <Chip
                          key={shape}
                          active={design.shape === shape}
                          onClick={() => set({ shape })}
                        >
                          <span className={`designer-shape-icon is-${shape}`} aria-hidden="true" />
                          {shape}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                )}
                {step === 1 && (
                  <fieldset>
                    <legend>{"Length"}</legend>
                    <div className="designer-row">
                      {lengths.map((length, i) => (
                        <Chip
                          key={length.label}
                          active={design.length === i}
                          onClick={() => set({ length: i })}
                        >
                          {length.label}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                )}
                {step === 2 && (
                  <fieldset>
                    <legend>
                      {"Shades "}
                      <small>
                        {selected === null
                          ? "pick up to 3, they alternate"
                          : "pick one for this nail"}
                      </small>
                    </legend>
                    <div className="designer-row mb-3">
                      {shadeFamilies.map((item) => (
                        <Chip
                          key={item.id}
                          active={family === item.id}
                          onClick={() => setFamily(item.id)}
                        >
                          {item.label}
                        </Chip>
                      ))}
                    </div>
                    <div className="designer-shades">
                      {shades
                        .filter((shade) => shade.family === family)
                        .map((shade) => (
                          <button
                            key={shade.id}
                            type="button"
                            className="designer-shade"
                            aria-pressed={shadeActive(shade.id)}
                            onClick={() => toggleShade(shade.id)}
                          >
                            <span
                              aria-hidden="true"
                              className="designer-swatch"
                              style={{ background: shade.colour }}
                            />
                            <span>{shadeLabel(shade)}</span>
                          </button>
                        ))}
                    </div>
                    <p className="designer-picked">
                      {"Your shades: "}
                      <strong>
                        {design.shades.map((id) => shadeLabel(shadeOf(id))).join(", ")}
                      </strong>
                    </p>
                    {shadesArePreview && (
                      <p className="designer-note">
                        {"Preview shades. Our shade cards with code numbers are coming soon."}
                      </p>
                    )}
                  </fieldset>
                )}
                {step === 3 && (
                  <fieldset>
                    <legend>
                      {"Finish "}
                      <small>{"for solid colours"}</small>
                    </legend>
                    <div className="designer-row">
                      {finishes.map((finish) => (
                        <Chip
                          key={finish}
                          active={design.finish === finish}
                          onClick={() => set({ finish })}
                        >
                          {finish}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                )}
                {step === 4 && (
                  <fieldset>
                    <legend>{"French tips"}</legend>
                    <div className="designer-row">
                      <Chip active={!design.french} onClick={() => set({ french: false })}>
                        {"None"}
                      </Chip>
                      {tipColours.map((tip) => (
                        <Chip
                          key={tip.name}
                          active={design.french && design.tip === tip.value}
                          onClick={() => set({ french: true, tip: tip.value })}
                        >
                          <span
                            className="designer-dot"
                            style={{ background: tip.value }}
                            aria-hidden="true"
                          />
                          {tip.name}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                )}
                {step === 5 && (
                  <fieldset>
                    <legend>
                      {"Charms "}
                      <small>
                        {selected === null ? "browse and pick up to 3" : "pick one for this nail"}
                      </small>
                    </legend>
                    <div className="designer-row mb-3">
                      {["All", ...charmGroups].map((group) => (
                        <Chip
                          key={group}
                          active={charmGroup === group}
                          onClick={() => setCharmGroup(group)}
                        >
                          {group}
                        </Chip>
                      ))}
                    </div>
                    <div className="designer-charms">
                      {charmOptions
                        .filter((charm) => charmGroup === "All" || charm.group === charmGroup)
                        .map((charm) => (
                          <button
                            key={charm.id}
                            type="button"
                            className="designer-charm"
                            aria-pressed={charmActive(charm.id)}
                            onClick={() => toggleCharm(charm.id)}
                          >
                            {charm.image ? (
                              <img src={charm.image} alt="" loading="lazy" />
                            ) : (
                              <svg viewBox="0 6.4 40 40" aria-hidden="true">
                                <CharmArt charm={charm} w={40} h={40} />
                              </svg>
                            )}
                            <span>{charmLabel(charm)}</span>
                          </button>
                        ))}
                    </div>
                    {design.charms.length > 0 && (
                      <>
                        <p className="designer-picked">
                          {"Your charms: "}
                          <strong>
                            {design.charms.map((id) => charmLabel(charmOf(id))).join(", ")}
                          </strong>
                        </p>
                        <div className="designer-row mt-2">
                          {placements.map((p) => (
                            <Chip
                              key={p.value}
                              active={design.placement === p.value}
                              onClick={() => set({ placement: p.value })}
                            >
                              {p.label}
                            </Chip>
                          ))}
                        </div>
                      </>
                    )}
                    {charmsArePreview && (
                      <p className="designer-note">
                        {"Preview charms. Photos of our full charm collection are coming soon."}
                      </p>
                    )}
                  </fieldset>
                )}
              </div>

              <div className="designer-step-nav">
                <button
                  type="button"
                  className="designer-back"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft aria-hidden="true" />
                  {"Back"}
                </button>
                {step < steps.length - 1 && (
                  <button type="button" className="designer-next" onClick={() => setStep(step + 1)}>
                    {`Next: ${steps[step + 1]!.label}`}
                    <ArrowRight aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            <div className="designer-actions">
              <Button
                type="button"
                variant="reference"
                size="reference"
                className="designer-surprise"
                onClick={() => dealt(randomDesign())}
              >
                <Dices className="w-4 h-4" />
                {"SURPRISE ME"}
              </Button>
              <Button
                type="button"
                variant="reference"
                size="reference"
                className="designer-surprise"
                disabled={!history.length}
                onClick={undo}
              >
                <Undo2 className="w-4 h-4" />
                {"UNDO"}
              </Button>
              <Button
                type="button"
                variant="reference"
                size="reference"
                className="designer-send"
                onClick={() => onUseDesign(design)}
              >
                <Send className="w-4 h-4" />
                {"SEND THIS DESIGN"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
