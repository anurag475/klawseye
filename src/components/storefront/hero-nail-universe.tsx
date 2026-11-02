import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const NailScene = lazy(() => import("./nail-universe/nail-scene"));

type Support = "pending" | "webgl" | "none";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Interactive 3D nail arrangement for the hero; renders `fallback` when WebGL is unavailable. */
export function HeroNailUniverse({ fallback }: { fallback: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const burst = useRef<(() => void) | null>(null);
  const [support, setSupport] = useState<Support>("pending");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [compact, setCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setSupport("none"), []);

  useEffect(() => {
    setSupport(hasWebGL() ? "webgl" : "none");
    const small = window.matchMedia("(max-width: 767px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCompact(small.matches);
      setReducedMotion(calm.matches);
    };
    sync();
    small.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      small.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = stage.current;
    if (!el || support !== "webgl") return;
    const io = new IntersectionObserver(([entry]) => {
      const inView = Boolean(entry?.isIntersecting);
      setVisible(inView);
      if (inView) setMounted(true);
    }, { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [support]);

  if (support === "none") return <>{fallback}</>;

  return (
    <div
      ref={stage}
      className="nail-stage"
      data-ready={ready}
      role="img"
      aria-label="Floating 3D press-on nails: pink chrome, jelly pink, nude French with pearls, glitter, gingham with a bow, and black-and-pink statement art"
      onPointerDown={() => burst.current?.()}
    >
      <div className="nail-stage-disc" aria-hidden="true" />
      <div className="nail-stage-tape washi-tape-pink" aria-hidden="true" />
      <div className="nail-canvas">
        {mounted && (
          <SceneBoundary onError={onError}>
            <Suspense fallback={null}>
              <NailScene key={compact ? "compact" : "full"} compact={compact} reducedMotion={reducedMotion} active={visible} burstRef={burst} onReady={onReady} />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      <div className="nail-stage-tag" aria-hidden="true">
        <p className="font-display text-sm">{"THE SIREN COLLECTION"}</p>
        <p className="font-body text-xs text-muted-foreground">{"Edition No. 04 · Handmade to order"}</p>
        <span className="bg-brandBlush text-brandBlue font-bold text-xs px-2.5 py-1 rounded-full border border-brandGingham">{"₹2,199"}</span>
      </div>
      <p className="nail-stage-hint font-handwritten" aria-hidden="true">{"tap the klaws ✦"}</p>
    </div>
  );
}
