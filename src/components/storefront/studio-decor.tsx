// Illustrated studio furniture. Everything here is decorative, so it is hidden from screen readers.

const bottleColors = [
  "var(--vibe)",
  "var(--nail-cherry)",
  "var(--nail-nude)",
  "var(--nail-hot)",
  "var(--nail-sky)",
  "var(--nail-gold)",
  "var(--nail-ink)",
  "var(--nail-lilac)",
  "var(--nail-sage)",
  "var(--nail-milk)",
  "var(--nail-chrome)",
];

function Bottle({ color }: { color: string }) {
  return (
    <svg className="studio-bottle" viewBox="0 0 40 74">
      <rect fill="var(--nail-ink)" height="30" rx="4" width="14" x="13" y="1" />
      <rect fill="oklch(1 0 0 / 22%)" height="26" rx="1.5" width="3" x="16" y="3" />
      <rect fill="var(--nail-silver)" height="4" width="18" x="11" y="30" />
      <path d="M8 40q0-6 6-6h12q6 0 6 6v26q0 7-7 7H15q-7 0-7-7z" fill={color} />
      <path d="M12 41q0-3 3-3h2v30h-1q-4 0-4-4z" fill="oklch(1 0 0 / 34%)" />
    </svg>
  );
}

/** Wall shelf of polish bottles; the first one always matches the chosen vibe. */
export function PolishShelf() {
  return (
    <div aria-hidden="true" className="studio-shelf">
      <div className="studio-shelf-bottles">
        {bottleColors.map((color) => (
          <Bottle color={color} key={color} />
        ))}
      </div>
      <div className="studio-shelf-plank" />
    </div>
  );
}

// Bulbs around the arched mirror, as [x%, y%]: up one side, over the arch, down the other.
const bulbs = [
  ...[88, 70, 52].map((y) => [0, y]),
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => {
    const angle = Math.PI - (i * Math.PI) / 6;
    return [50 + 50 * Math.cos(angle), 36 - 36 * Math.sin(angle)];
  }),
  ...[52, 70, 88].map((y) => [100, y]),
] as [number, number][];

export function MirrorBulbs() {
  return (
    <span aria-hidden="true" className="studio-bulbs">
      {bulbs.map(([x, y]) => (
        <span
          key={`${x.toFixed(1)}-${y.toFixed(1)}`}
          style={{ left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%` }}
        />
      ))}
    </span>
  );
}

export function HangingPlant() {
  return (
    <svg aria-hidden="true" className="studio-plant" viewBox="0 0 120 170">
      <path
        d="M60 0v44M60 0L34 50M60 0l26 50"
        fill="none"
        stroke="var(--wall-ink)"
        strokeOpacity=".5"
        strokeWidth="1.5"
      />
      <path d="M28 50h64l-8 42q-1 6-7 6H43q-6 0-7-6z" fill="var(--nail-nude)" />
      <path d="M28 50h64l-2 9H30z" fill="oklch(0 0 0 / 12%)" />
      <g fill="var(--nail-sage)">
        <path d="M60 52C36 38 22 44 12 60c20 4 36 2 48-8z" />
        <path d="M60 52c24-14 38-8 48 8-20 4-36 2-48-8z" />
        <path d="M60 52C52 28 58 14 70 6c6 20 2 36-10 46z" />
        <path d="M36 54c-14 18-16 40-8 64 14-18 18-42 8-64z" />
        <path d="M84 54c16 16 20 46 10 86-14-26-20-58-10-86z" />
      </g>
    </svg>
  );
}

/** Nail lamp, tool cup and hand towel that sit at the end of the desk. */
export function DeskProps() {
  return (
    <div aria-hidden="true" className="studio-desk-props">
      <svg className="studio-tools" viewBox="0 0 70 120">
        <rect
          fill="var(--nail-gold)"
          height="62"
          rx="2"
          transform="rotate(-9 22 40)"
          width="5"
          x="20"
          y="8"
        />
        <rect
          fill="var(--nail-cherry)"
          height="70"
          rx="2"
          transform="rotate(5 40 40)"
          width="5"
          x="37"
          y="2"
        />
        <path d="M46 12l6-10 4 2-4 12z" fill="var(--nail-ink)" />
        <rect
          fill="var(--nail-silver)"
          height="66"
          rx="2"
          transform="rotate(12 54 44)"
          width="4"
          x="52"
          y="10"
        />
        <path d="M12 58h46l-5 56q-.5 5-5 5H22q-4.500 0-5-5z" fill="var(--brand-blush)" />
        <path d="M12 58h46l-.8 9H12.800z" fill="oklch(1 0 0 / 45%)" />
      </svg>
      <svg className="studio-lamp" viewBox="0 0 170 104">
        <ellipse cx="85" cy="92" fill="var(--nail-lilac)" opacity=".85" rx="60" ry="10" />
        <path
          d="M8 96C8 40 40 6 85 6s77 34 77 90q0 6-7 6h-22q-5 0-6-6-4-34-47-34T38 96q-1 6-6 6H15q-7 0-7-6z"
          fill="var(--nail-pearl)"
        />
        <path
          d="M24 66C32 34 54 18 85 18"
          fill="none"
          stroke="oklch(1 0 0 / 90%)"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <rect fill="var(--nail-ink)" height="9" rx="4.500" width="34" x="68" y="24" />
        <circle cx="76" cy="28.500" fill="var(--brand-rose)" r="2.500" />
      </svg>
    </div>
  );
}
