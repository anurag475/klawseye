import {
  charmLabel,
  charmOptions,
  shadeFamilies,
  shadeLabel,
  shades,
  type CharmOption,
  type ShadeFamily,
} from "./design-options";

export type Shape = "almond" | "coffin" | "square" | "stiletto" | "oval";
export type Finish = "glossy" | "chrome" | "matte" | "glitter";
export type Placement = "all" | "accent" | "mix";
/** A single nail painted differently from the rest. `charm: null` means this nail has no charm. */
export type NailOverride = { shade?: string; charm?: string | null };

export type Design = {
  shape: Shape;
  length: number;
  shades: string[];
  finish: Finish;
  french: boolean;
  tip: string;
  charms: string[];
  placement: Placement;
  overrides: Record<number, NailOverride>;
};

export const shapes: Shape[] = ["almond", "coffin", "square", "stiletto", "oval"];
export const lengths = [
  { label: "Short", scale: 0.78 },
  { label: "Medium", scale: 1 },
  { label: "Long", scale: 1.3 },
] as const;
export const finishes: Finish[] = ["glossy", "chrome", "matte", "glitter"];
export const placements: { value: Placement; label: string }[] = [
  { value: "all", label: "Every nail" },
  { value: "accent", label: "Accent nails" },
  { value: "mix", label: "Mix & match" },
];
export const tipColours = [
  { name: "White", value: "var(--nail-pearl)" },
  { name: "Silver", value: "var(--nail-silver)" },
  { name: "Gold", value: "var(--nail-gold)" },
  { name: "Rose", value: "var(--brand-rose)" },
  { name: "Ink", value: "var(--nail-ink)" },
];
export const fingerNames = ["Thumb", "Index", "Middle", "Ring", "Pinky"] as const;
const accentNails = [0, 3];

export const initialDesign: Design = {
  shape: "almond",
  length: 1,
  shades: ["solid-blush", "solid-navy"],
  finish: "chrome",
  french: true,
  tip: "var(--nail-silver)",
  charms: ["pearls", "star"],
  placement: "accent",
  overrides: {},
};

/** Ready-made starting points, named after the looks the studio talks about. */
export const looks: { id: string; name: string; line: string; design: Design }[] = [
  {
    id: "cyber",
    name: "Cyber Chrome",
    line: "Metallic cyber charms",
    design: {
      shape: "coffin",
      length: 2,
      shades: ["solid-sky", "solid-lilac"],
      finish: "chrome",
      french: true,
      tip: "var(--nail-silver)",
      charms: ["cross", "star"],
      placement: "mix",
      overrides: {},
    },
  },
  {
    id: "cottage",
    name: "Cottagecore",
    line: "Delicate cherries",
    design: {
      shape: "almond",
      length: 1,
      shades: ["solid-milk", "solid-blush", "solid-sage"],
      finish: "glossy",
      french: false,
      tip: "var(--nail-pearl)",
      charms: ["cherry", "flower"],
      placement: "mix",
      overrides: {},
    },
  },
  {
    id: "gothic",
    name: "Gothic Tears",
    line: "Deep, dark and dramatic",
    design: {
      shape: "stiletto",
      length: 2,
      shades: ["cateye-ruby", "solid-ink"],
      finish: "glossy",
      french: false,
      tip: "var(--nail-ink)",
      charms: ["cross", "heart"],
      placement: "accent",
      overrides: {},
    },
  },
  {
    id: "classic",
    name: "Everyday Classic",
    line: "Clean with a crisp tip",
    design: {
      shape: "oval",
      length: 0,
      shades: ["solid-nude", "solid-milk"],
      finish: "glossy",
      french: true,
      tip: "var(--nail-pearl)",
      charms: [],
      placement: "accent",
      overrides: {},
    },
  },
];

const pick = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]!;
const nameOf = (list: { name: string; value: string }[], value: string) =>
  list.find((item) => item.value === value)?.name ?? value;
export const shadeOf = (id: string) => shades.find((shade) => shade.id === id)!;
export const charmOf = (id: string) => charmOptions.find((charm) => charm.id === id)!;
const familyName = (family: ShadeFamily) =>
  shadeFamilies.find((item) => item.id === family)!.label.toLowerCase();

export function randomDesign(): Design {
  const picked = [...shades]
    .sort(() => Math.random() - 0.5)
    .slice(0, 1 + Math.floor(Math.random() * 3))
    .map((shade) => shade.id);
  return {
    shape: pick(shapes),
    length: Math.floor(Math.random() * lengths.length),
    shades: picked,
    finish: pick(finishes),
    french: Math.random() > 0.5,
    tip: pick(tipColours).value,
    charms: [...charmOptions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3))
      .map((charm) => charm.id),
    placement: pick(placements).value,
    overrides: {},
  };
}

/** Shade shown on a nail: its own if it has one, otherwise the set's alternating shades. */
export const shadeIdFor = (design: Design, index: number) =>
  design.overrides[index]?.shade ?? design.shades[index % design.shades.length]!;

/** The charm a nail gets from the set's charms and placement, ignoring its own override. */
function setCharmFor(design: Design, index: number): CharmOption | null {
  if (!design.charms.length) return null;
  if (design.placement === "all") return charmOf(design.charms[0]!);
  if (design.placement === "accent")
    return accentNails.includes(index)
      ? charmOf(design.charms[accentNails.indexOf(index) % design.charms.length]!)
      : null;
  return index % 2 === 0 ? charmOf(design.charms[(index / 2) % design.charms.length]!) : null;
}

export function charmFor(design: Design, index: number): CharmOption | null {
  const own = design.overrides[index]?.charm;
  if (own === null) return null;
  return own ? charmOf(own) : setCharmFor(design, index);
}

function withOverride(design: Design, index: number, next: NailOverride): Design {
  const overrides = { ...design.overrides };
  if (next.shade === undefined && next.charm === undefined) delete overrides[index];
  else overrides[index] = next;
  return { ...design, overrides };
}

/** Paints one nail; choosing the shade it already has on its own returns it to the set's shades. */
export function paintNail(design: Design, index: number, shade: string): Design {
  const { shade: current, ...rest } = design.overrides[index] ?? {};
  return withOverride(design, index, current === shade ? rest : { ...rest, shade });
}

/** Sets one nail's charm; choosing the charm it already shows removes it from that nail. */
export function charmNail(design: Design, index: number, charm: string): Design {
  const { charm: _previous, ...rest } = design.overrides[index] ?? {};
  return withOverride(design, index, {
    ...rest,
    charm: charmFor(design, index)?.id === charm ? null : charm,
  });
}

export const resetNail = (design: Design, index: number) => withOverride(design, index, {});

/** Plain-language summary of a design, used to pre-fill the custom request. */
export function describeDesign(design: Design) {
  const painted = Object.entries(design.overrides)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([index, nail]) => {
      const parts = [
        nail.shade ? shadeLabel(shadeOf(nail.shade)) : "",
        nail.charm === null
          ? "no charm"
          : nail.charm
            ? `${charmLabel(charmOf(nail.charm))} charm`
            : "",
      ].filter(Boolean);
      return `${fingerNames[Number(index)]}: ${parts.join(", ")}`;
    });
  const lines = [
    `Shape: ${design.shape} · Length: ${lengths[design.length]!.label.toLowerCase()}`,
    `Shades: ${design.shades.map((id) => `${shadeLabel(shadeOf(id))} (${familyName(shadeOf(id).family)})`).join(", ")}`,
    design.shades.some((id) => shadeOf(id).family === "solid")
      ? `Finish on solid colours: ${design.finish}`
      : "",
    design.french ? `French tips: ${nameOf(tipColours, design.tip).toLowerCase()}` : "",
    design.charms.length
      ? `Charms: ${design.charms.map((id) => charmLabel(charmOf(id))).join(", ")} (${placements.find((p) => p.value === design.placement)!.label.toLowerCase()})`
      : "",
    ...painted,
  ];
  return `My design from the KLAWSEYE designer:\n${lines
    .filter(Boolean)
    .map((line) => `• ${line}`)
    .join("\n")}`;
}
