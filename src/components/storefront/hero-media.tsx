import { useEffect, useRef, useState, type ReactNode } from "react";
// 3D nail scene paused for now; restore this import and the line below to bring it back.
// import { HeroNailUniverse } from "./hero-nail-universe";

// Brand intro film for the homepage hero. Put the file in /public/videos and set
// `src` (and a still frame as `poster`); until then the 3D nail scene shows instead.
const heroVideo = {
  src: "",
  poster: "",
  label: "A KLAWSEYE client showing off her handmade press-on set",
};

export function HeroMedia({ fallback }: { fallback: ReactNode }) {
  const video = useRef<HTMLVideoElement>(null);
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setCalm(query.matches);
      if (query.matches) video.current?.pause();
      else void video.current?.play().catch(() => undefined);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // if (!heroVideo.src) return <HeroNailUniverse fallback={fallback} />;
  if (!heroVideo.src) return <>{fallback}</>;

  return (
    <figure className="hero-video">
      <div className="hero-video-tape washi-tape-pink" aria-hidden="true" />
      <video
        ref={video}
        className="hero-video-media"
        src={heroVideo.src}
        poster={heroVideo.poster || undefined}
        aria-label={heroVideo.label}
        autoPlay={!calm}
        controls={calm}
        muted
        loop
        playsInline
        preload="metadata"
      />
      <figcaption className="hero-video-caption font-handwritten">{"real klaws, real hands ✨"}</figcaption>
    </figure>
  );
}
