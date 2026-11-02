import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { Dices, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Shape = "almond" | "coffin" | "square" | "stiletto" | "oval";
type Finish = "glossy" | "chrome" | "jelly" | "matte" | "glitter";
type Charm = "pearls" | "star" | "heart" | "bow" | "cherry" | "flower";
type Placement = "all" | "accent" | "mix";

const shapes: Shape[] = ["almond", "coffin", "square", "stiletto", "oval"];
const lengths = [{ label: "Short", scale: 0.78 }, { label: "Medium", scale: 1 }, { label: "Long", scale: 1.3 }] as const;
const finishes: Finish[] = ["glossy", "chrome", "jelly", "matte", "glitter"];
const charms: Charm[] = ["pearls", "star", "heart", "bow", "cherry", "flower"];
const placements: { value: Placement; label: string }[] = [
  { value: "all", label: "Every nail" },
  { value: "accent", label: "Accent nails" },
  { value: "mix", label: "Mix & match" },
];
const palette = [
  { name: "Blush", value: "var(--brand-blush)" },
  { name: "Rose", value: "var(--brand-rose)" },
  { name: "Hot pink", value: "var(--nail-hot)" },
  { name: "Cherry", value: "var(--nail-cherry)" },
  { name: "Nude", value: "var(--nail-nude)" },
  { name: "Milk", value: "var(--nail-milk)" },
  { name: "Lilac", value: "var(--nail-lilac)" },
  { name: "Sky", value: "var(--nail-sky)" },
  { name: "Sage", value: "var(--nail-sage)" },
  { name: "Navy", value: "var(--primary)" },
  { name: "Ink", value: "var(--nail-ink)" },
  { name: "Gold", value: "var(--nail-gold)" },
];
const tipColours = [
  { name: "White", value: "var(--nail-pearl)" },
  { name: "Silver", value: "var(--nail-silver)" },
  { name: "Gold", value: "var(--nail-gold)" },
  { name: "Rose", value: "var(--brand-rose)" },
  { name: "Ink", value: "var(--nail-ink)" },
];

// Thumb to pinky: relative width and how far each nail is fanned out.
const fingers = [
  { width: 1.25, tilt: -9, x: 56, drop: 34 },
  { width: 1, tilt: -4, x: 152, drop: 8 },
  { width: 1.06, tilt: 0, x: 248, drop: 0 },
  { width: 0.96, tilt: 4, x: 342, drop: 10 },
  { width: 0.8, tilt: 9, x: 428, drop: 30 },
];
const accentNails = [0, 3];

type Point = readonly [number, number];
type Half = readonly [Point, Point, Point, Point, Point, Point];

// Right half of the free edge, from the side wall up to the centre of the tip, as two cubic curves.
// Every shape uses the same command structure so the outline can morph between them.
function rightHalf(shape: Shape, w: number, h: number): { top: number; seg: Half } {
  const line = (a: Point, b: Point): [Point, Point, Point] => [[a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3], [a[0] + (2 * (b[0] - a[0])) / 3, a[1] + (2 * (b[1] - a[1])) / 3], b];
  const mid: Point = [w / 2, 0];
  switch (shape) {
    case "square": { const t = w * 0.16; return { top: t, seg: [[w, t * 0.4], [w * 0.97, 0], [w * 0.84, 0], ...line([w * 0.84, 0], mid)] }; }
    case "oval": { const t = w * 0.5; return { top: t, seg: [[w, t * 0.45], [w * 0.78, 0], mid, mid, mid, mid] }; }
    case "almond": { const t = h * 0.44; return { top: t, seg: [[w, t * 0.42], [w * 0.68, 0], mid, mid, mid, mid] }; }
    case "stiletto": { const t = h * 0.58; return { top: t, seg: [[w, t * 0.45], [w * 0.56, h * 0.05], mid, mid, mid, mid] }; }
    case "coffin": { const t = h * 0.42; const corner: Point = [w * 0.79, 0]; return { top: t, seg: [...line([w, t], corner), ...line(corner, mid)] }; }
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
  return { top, d: `M0 ${base.toFixed(1)} A${(w / 2).toFixed(1)} ${r.toFixed(1)} 0 0 0 ${w.toFixed(1)} ${base.toFixed(1)} L${w.toFixed(1)} ${top.toFixed(1)} C${p(a1)} ${p(b1)} ${p(e1)} C${p(a2)} ${p(b2)} ${p([w / 2, 0])} C${p(left[0]!)} ${p(left[1]!)} ${p(left[2]!)} C${p(left[3]!)} ${p(left[4]!)} ${p(left[5]!)} Z` };
}

function CharmArt({ charm, w, h }: { charm: Charm; w: number; h: number }) {
  const cx = w / 2;
  const cy = h * 0.66;
  const s = w * 0.26;
  switch (charm) {
    case "pearls": return <g>{[[-0.9, 0.4], [0, -0.3], [0.9, 0.4]].map(([dx, dy], i) => <circle key={i} cx={cx + dx! * s} cy={cy + dy! * s} r={s * 0.5} fill="url(#nd-pearl)" stroke="oklch(0.6 0.02 60 / 40%)" strokeWidth=".6" />)}</g>;
    case "star": return <path d={Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2; const rr = i % 2 ? s * 0.5 : s * 1.15; return `${i ? "L" : "M"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`; }).join(" ") + "Z"} fill="url(#nd-metal)" stroke="oklch(0.5 0.03 80 / 50%)" strokeWidth=".6" />;
    case "heart": return <path d={`M${cx} ${cy + s * 0.95} C${cx - s * 1.5} ${cy - s * 0.1} ${cx - s * 0.7} ${cy - s * 1.2} ${cx} ${cy - s * 0.35} C${cx + s * 0.7} ${cy - s * 1.2} ${cx + s * 1.5} ${cy - s * 0.1} ${cx} ${cy + s * 0.95}Z`} fill="var(--nail-cherry)" stroke="oklch(1 0 0 / 60%)" strokeWidth="1" />;
    case "bow": return <g fill="var(--nail-pearl)" stroke="oklch(0.5 0.03 20 / 45%)" strokeWidth=".7"><path d={`M${cx} ${cy} L${cx - s * 1.3} ${cy - s * 0.7} L${cx - s * 1.2} ${cy + s * 0.75}Z M${cx} ${cy} L${cx + s * 1.3} ${cy - s * 0.7} L${cx + s * 1.2} ${cy + s * 0.75}Z M${cx - s * 0.2} ${cy + s * 0.2} L${cx - s * 0.6} ${cy + s * 1.4} M${cx + s * 0.2} ${cy + s * 0.2} L${cx + s * 0.6} ${cy + s * 1.4}`} /><circle cx={cx} cy={cy} r={s * 0.32} /></g>;
    case "cherry": return <g><path d={`M${cx - s * 0.55} ${cy + s * 0.2} Q${cx - s * 0.2} ${cy - s} ${cx + s * 0.3} ${cy - s * 1.2} M${cx + s * 0.55} ${cy + s * 0.35} Q${cx + s * 0.4} ${cy - s * 0.6} ${cx + s * 0.3} ${cy - s * 1.2}`} fill="none" stroke="var(--nail-sage)" strokeWidth="1.4" strokeLinecap="round" /><circle cx={cx - s * 0.55} cy={cy + s * 0.5} r={s * 0.5} fill="var(--nail-cherry)" /><circle cx={cx + s * 0.55} cy={cy + s * 0.65} r={s * 0.5} fill="var(--nail-cherry)" /></g>;
    case "flower": return <g>{Array.from({ length: 5 }, (_, i) => { const a = (Math.PI * 2 * i) / 5 - Math.PI / 2; return <circle key={i} cx={cx + Math.cos(a) * s * 0.62} cy={cy + Math.sin(a) * s * 0.62} r={s * 0.48} fill="var(--nail-pearl)" stroke="oklch(0.6 0.03 20 / 35%)" strokeWidth=".6" />; })}<circle cx={cx} cy={cy} r={s * 0.34} fill="var(--nail-gold)" /></g>;
  }
}

type Design = { shape: Shape; length: number; colours: string[]; finish: Finish; french: boolean; tip: string; charms: Charm[]; placement: Placement };

const initialDesign: Design = { shape: "almond", length: 1, colours: ["var(--brand-blush)", "var(--primary)"], finish: "chrome", french: true, tip: "var(--nail-silver)", charms: ["pearls", "star"], placement: "accent" };

const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]!;
const nameOf = (list: { name: string; value: string }[], value: string) => list.find(item => item.value === value)?.name ?? value;

function randomDesign(): Design {
  const colours = [...palette].sort(() => Math.random() - 0.5).slice(0, 1 + Math.floor(Math.random() * 3)).map(c => c.value);
  return {
    shape: pick(shapes),
    length: Math.floor(Math.random() * lengths.length),
    colours,
    finish: pick(finishes),
    french: Math.random() > 0.5,
    tip: pick(tipColours).value,
    charms: [...charms].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3)),
    placement: pick(placements).value,
  };
}

/** Plain-language summary of a design, used to pre-fill the custom request. */
function describeDesign(design: Design) {
  const lines = [
    `Shape: ${design.shape} · Length: ${lengths[design.length]!.label.toLowerCase()}`,
    `Colours: ${design.colours.map(c => (c.startsWith("#") ? c : nameOf(palette, c))).join(", ")}`,
    `Finish: ${design.finish}`,
    design.french ? `French tips: ${nameOf(tipColours, design.tip).toLowerCase()}` : "",
    design.charms.length ? `Charms: ${design.charms.join(", ")} (${placements.find(p => p.value === design.placement)!.label.toLowerCase()})` : "",
  ];
  return `My design from the KLAWSEYE designer:\n${lines.filter(Boolean).map(line => `• ${line}`).join("\n")}`;
}

function charmFor(design: Design, index: number): Charm | null {
  if (!design.charms.length) return null;
  if (design.placement === "all") return design.charms[0]!;
  if (design.placement === "accent") return accentNails.includes(index) ? design.charms[accentNails.indexOf(index) % design.charms.length]! : null;
  return index % 2 === 0 ? design.charms[(index / 2) % design.charms.length]! : null;
}

function NailTray({ design, spin }: { design: Design; spin: number }) {
  const uid = useId().replace(/:/g, "");
  const scale = lengths[design.length]!.scale;
  return (
<svg className="nail-tray-art" viewBox="0 0 520 360" role="img" aria-label={`Preview: ${describeDesign(design).split("\n").slice(1).join(", ").replace(/• /g, "")}`}>
<defs>
<radialGradient id="nd-pearl" cx="35%" cy="30%" r="70%"><stop offset="0" stopColor="white" /><stop offset=".55" stopColor="var(--nail-pearl)" /><stop offset="1" stopColor="var(--nail-silver)" /></radialGradient>
<linearGradient id="nd-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="white" /><stop offset=".45" stopColor="var(--nail-gold)" /><stop offset="1" stopColor="oklch(0.62 0.1 80)" /></linearGradient>
<linearGradient id={`${uid}-chrome`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="black" stopOpacity=".35" /><stop offset=".22" stopColor="white" stopOpacity=".85" /><stop offset=".4" stopColor="white" stopOpacity="0" /><stop offset=".62" stopColor="black" stopOpacity=".18" /><stop offset=".8" stopColor="white" stopOpacity=".6" /><stop offset="1" stopColor="black" stopOpacity=".3" /></linearGradient>
<linearGradient id={`${uid}-depth`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="white" stopOpacity=".18" /><stop offset=".7" stopColor="black" stopOpacity="0" /><stop offset="1" stopColor="black" stopOpacity=".16" /></linearGradient>
<pattern id={`${uid}-glitter`} width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" opacity=".9" /><circle cx="6.5" cy="5" r=".8" fill="var(--nail-gold)" /><circle cx="3.5" cy="7.5" r=".6" fill="white" opacity=".7" /></pattern>
<filter id={`${uid}-shadow`} x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="oklch(0.35 0.04 30)" floodOpacity=".35" /></filter>
</defs>
{fingers.map((finger, i) => {
  const w = 70 * finger.width;
  const h = (150 + 30 * finger.width) * scale;
  const { d, top } = nailPath(design.shape, w, h);
  const colour = design.colours[i % design.colours.length]!;
  const charm = charmFor(design, i);
  const clip = `${uid}-clip-${i}`;
  const x = finger.x - w / 2 + 18;
  const y = 345 - h - finger.drop;
  return (
<g key={`${i}-${spin}`} className="nail-tray-nail" style={{ "--delay": `${i * 70}ms` } as CSSProperties} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${finger.tilt} ${w / 2} ${h})`}>
<clipPath id={clip}><path style={{ d: `path("${d}")` } as CSSProperties} d={d} /></clipPath>
<g filter={`url(#${uid}-shadow)`}>
<path className="nail-shape" style={{ d: `path("${d}")` } as CSSProperties} d={d} fill={design.finish === "jelly" ? "var(--nail-nude)" : colour} />
</g>
<g clipPath={`url(#${clip})`}>
{design.finish === "jelly" && <rect width={w} height={h} fill={colour} opacity=".72" />}
{design.finish === "chrome" && <rect width={w} height={h} fill={`url(#${uid}-chrome)`} />}
{design.finish === "glitter" && <rect width={w} height={h} fill={`url(#${uid}-glitter)`} />}
{design.french && <ellipse className="nail-tip" cx={w / 2} cy={-h * 0.04} rx={w * 0.78} ry={Math.max(top * 0.82, h * 0.2)} fill={design.tip} />}
{design.french && design.finish === "chrome" && <ellipse cx={w / 2} cy={-h * 0.04} rx={w * 0.78} ry={Math.max(top * 0.82, h * 0.2)} fill={`url(#${uid}-chrome)`} opacity=".7" />}
<rect width={w} height={h} fill={`url(#${uid}-depth)`} />
{design.finish !== "matte" && <ellipse cx={w * 0.28} cy={h * 0.55} rx={w * 0.08} ry={h * 0.26} fill="white" opacity={design.finish === "jelly" ? 0.6 : 0.42} />}
{design.finish !== "matte" && <ellipse cx={w * 0.62} cy={h * 0.18} rx={w * 0.12} ry={h * 0.05} fill="white" opacity=".3" />}
{charm && <g className="nail-charm"><CharmArt charm={charm} w={w} h={h} /></g>}
</g>
<path style={{ d: `path("${d}")` } as CSSProperties} d={d} fill="none" stroke="oklch(0.3 0.03 20 / 18%)" strokeWidth="1" />
</g>
  );
})}
</svg>
  );
}

function Chip({ active, onClick, children, label }: { active: boolean; onClick: () => void; children: ReactNode; label?: string }) {
  return <button type="button" className="designer-chip" aria-pressed={active} aria-label={label} onClick={onClick}>{children}</button>;
}

/** Interactive press-on designer: build a set and send it as a custom request. */
export function NailDesigner({ onUseDesign }: { onUseDesign: (brief: string) => void }) {
  const [design, setDesign] = useState<Design>(initialDesign);
  const [spin, setSpin] = useState(0);
  const [custom, setCustom] = useState("#c8a2c8");
  const set = (patch: Partial<Design>) => setDesign(current => ({ ...current, ...patch }));
  const toggleColour = (value: string) => set({ colours: design.colours.includes(value) ? (design.colours.length > 1 ? design.colours.filter(c => c !== value) : design.colours) : [...design.colours, value].slice(-3) });
  const toggleCharm = (charm: Charm) => set({ charms: design.charms.includes(charm) ? design.charms.filter(c => c !== charm) : [...design.charms, charm].slice(-3) });
  const surprise = () => { setDesign(randomDesign()); setSpin(s => s + 1); };

  return (
<section className="nail-designer py-16 sm:py-20" id="designer" data-purpose="nail-designer">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center max-w-2xl mx-auto mb-10">
<span className="inline-block bg-card text-brandBlue font-body font-bold text-xs px-3.5 py-1 rounded-full border-2 border-brandBlue uppercase mb-3">{"PLAY BEFORE YOU ORDER"}</span>
<h2 className="font-display text-3xl sm:text-5xl text-brandBlue leading-tight">{"DESIGN YOUR "}<span className="hero-scribble text-brandRose">{"KLAWS"}</span></h2>
<p className="font-body text-copy mt-3 text-base">{"Mix shapes, colours, finishes and charms, watch your set come to life, then send it straight to the studio."}</p>
</div>

<div className="grid lg:grid-cols-12 gap-8 items-start">
<div className="lg:col-span-7 lg:sticky lg:top-28">
<div className="nail-tray">
<span aria-hidden="true" className="nail-tray-label font-handwritten">{"your set ✦ handmade to order"}</span>
<NailTray design={design} spin={spin} />
</div>
<div className="flex flex-wrap justify-center gap-3 mt-6">
<Button type="button" variant="reference" size="reference" className="designer-surprise" onClick={surprise}><Dices className="w-4 h-4" />{"SURPRISE ME"}</Button>
<Button type="button" variant="reference" size="reference" className="designer-send" onClick={() => onUseDesign(describeDesign(design))}><Send className="w-4 h-4" />{"SEND THIS DESIGN"}</Button>
</div>
</div>

<div className="lg:col-span-5 designer-panel">
<fieldset>
<legend>{"1 · Shape"}</legend>
<div className="designer-row">{shapes.map(shape => <Chip key={shape} active={design.shape === shape} onClick={() => set({ shape })}><span className={`designer-shape-icon is-${shape}`} aria-hidden="true" />{shape}</Chip>)}</div>
</fieldset>
<fieldset>
<legend>{"2 · Length"}</legend>
<div className="designer-row">{lengths.map((length, i) => <Chip key={length.label} active={design.length === i} onClick={() => set({ length: i })}>{length.label}</Chip>)}</div>
</fieldset>
<fieldset>
<legend>{"3 · Colours "}<small>{"pick up to 3, they alternate"}</small></legend>
<div className="designer-row">
{palette.map(colour => <button key={colour.name} type="button" className="designer-swatch" style={{ background: colour.value }} aria-pressed={design.colours.includes(colour.value)} aria-label={colour.name} title={colour.name} onClick={() => toggleColour(colour.value)} />)}
<label className="designer-swatch designer-swatch-custom" title="Your own colour" style={{ background: custom }} data-active={design.colours.includes(custom) || undefined}>
<input type="color" value={custom} aria-label="Pick your own colour" onChange={event => { const next = event.target.value; set({ colours: [...design.colours.filter(c => c !== custom), next].slice(-3) }); setCustom(next); }} />
</label>
</div>
</fieldset>
<fieldset>
<legend>{"4 · Finish"}</legend>
<div className="designer-row">{finishes.map(finish => <Chip key={finish} active={design.finish === finish} onClick={() => set({ finish })}>{finish}</Chip>)}</div>
</fieldset>
<fieldset>
<legend>{"5 · French tips"}</legend>
<div className="designer-row">
<Chip active={!design.french} onClick={() => set({ french: false })}>{"None"}</Chip>
{tipColours.map(tip => <Chip key={tip.name} active={design.french && design.tip === tip.value} onClick={() => set({ french: true, tip: tip.value })}><span className="designer-dot" style={{ background: tip.value }} aria-hidden="true" />{tip.name}</Chip>)}
</div>
</fieldset>
<fieldset>
<legend>{"6 · Charms "}<small>{"up to 3"}</small></legend>
<div className="designer-row">{charms.map(charm => <Chip key={charm} active={design.charms.includes(charm)} onClick={() => toggleCharm(charm)}>{charm}</Chip>)}</div>
{design.charms.length > 0 && <div className="designer-row mt-2">{placements.map(p => <Chip key={p.value} active={design.placement === p.value} onClick={() => set({ placement: p.value })}>{p.label}</Chip>)}</div>}
</fieldset>
</div>
</div>
</div>
</section>
  );
}
