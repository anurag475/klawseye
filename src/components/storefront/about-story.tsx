import { useEffect, useRef, type CSSProperties } from "react";
import { Sparkle } from "lucide-react";

const fanPhotos = [
  {
    slot: "about-fan-slot-a",
    src: "/about/everyday-classic.jpg",
    caption: "everyday classics",
    alt: "Yellow polka-dot French tip nails with tiny painted blueberries",
    position: "50% 28%",
  },
  {
    slot: "about-fan-slot-b",
    src: "/about/little-piece-of-art.jpg",
    caption: "a little piece of art",
    alt: "Short nails in teal, amber and navy with a 3D flower, a star and polka dots",
    position: "50% 42%",
  },
  {
    slot: "about-fan-slot-c",
    src: "/about/unapologetically-extra.jpg",
    caption: "unapologetically extra",
    alt: "Long stiletto nails with 3D pink petals, gold swirls and gemstones",
    position: "60% 32%",
  },
];

const founderPath = [
  "A hobby",
  "A self-taught passion",
  "Professional certification",
  "A brand of her own",
];

type StatementPart = { text: string; accent?: boolean };

const statement: StatementPart[] = [
  {
    text: "Today, Klawseye is building a community of people who choose to be unapologetically themselves. Because there’s a set for",
  },
  { text: "every mood,", accent: true },
  { text: "every version of you", accent: true },
  { text: "and" },
  { text: "every main-character moment.", accent: true },
];

const statementWords = statement.flatMap((part) =>
  part.text.split(" ").map((word) => ({ word, accent: part.accent })),
);

/** Inks the statement in word by word on scroll. Renders fully legible until JS opts in. */
function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      const viewport = window.innerHeight;
      const progress = (viewport * 0.88 - element.getBoundingClientRect().top) / (viewport * 0.48);
      element.style.setProperty("--ink", String(Math.min(1, Math.max(0, progress))));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <p
      ref={ref}
      className="about-statement"
      style={{ "--words": statementWords.length } as CSSProperties}
    >
      {statementWords.map(({ word, accent }, index) => (
        <span key={index}>
          <span
            className={accent ? "about-word about-word-accent" : "about-word"}
            style={{ "--i": index } as CSSProperties}
          >
            {word}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}

export function AboutStory() {
  return (
    <>
      <section className="about-intro" data-purpose="about-klawseye" id="our-story">
        <div className="about-intro-grid">
          <div className="about-intro-copy">
            <p className="about-eyebrow">About Klawseye</p>
            <h1 className="about-title">
              Klawseye is where creativity meets{" "}
              <span className="hero-scribble">self-expression.</span>
            </h1>
            <p className="about-lede">
              Born out of a love for nail art, it’s a press-on nail brand made for those who love to
              experiment, break the rules and let their style do the talking.
            </p>
            <p className="about-note">
              From everyday classics to unapologetically extra designs, every set is a little piece
              of art, made to celebrate individuality.
            </p>
          </div>

          <div className="about-fan">
            <div aria-hidden="true" className="about-fan-arch" />
            <Sparkle
              aria-hidden="true"
              className="about-fan-spark about-fan-spark-a"
              fill="currentColor"
            />
            <Sparkle
              aria-hidden="true"
              className="about-fan-spark about-fan-spark-b"
              fill="currentColor"
            />
            {fanPhotos.map(({ slot, src, caption, alt, position }, index) => (
              <div
                className={`about-fan-slot ${slot} reveal-pop`}
                key={src}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <figure className="about-fan-card">
                  <img
                    alt={alt}
                    decoding="async"
                    height={1200}
                    src={src}
                    style={{ objectPosition: position }}
                    width={900}
                  />
                  <figcaption className="font-handwritten">{caption}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-founder" data-purpose="about-founder" id="founder">
        <div className="about-founder-grid">
          <div className="about-founder-stage">
            <div aria-hidden="true" className="about-founder-arch">
              <div className="washi-tape-pink about-founder-tape" />
            </div>
            <figure className="about-founder-character reveal-pop">
              <img
                alt="Illustrated Swasti, founder of Klawseye, with long red hair, reaching towards you to show off bright flower and polka-dot nails"
                decoding="async"
                height={1280}
                loading="lazy"
                src="/about/swasti-character.webp"
                width={1207}
              />
            </figure>
            <span aria-hidden="true" className="about-founder-ring" />
            <span aria-hidden="true" className="about-founder-ring about-founder-ring-late" />
          </div>

          <div className="about-founder-copy">
            <p className="about-eyebrow about-eyebrow-light">About the Founder</p>
            <h2 className="about-founder-title">The creative route.</h2>
            <p className="about-founder-lede">
              Klawseye was founded by <strong>Swasti</strong>, a 24-year-old who chose to take the
              creative route over the conventional corporate life after completing her MBA.
            </p>
            <p className="about-founder-body">
              What began as a hobby of doing her own nails to save a little money turned into a
              self-taught passion, professional certification and eventually, a brand of her own.
            </p>
            <ol aria-label="How Klawseye began" className="about-path">
              {founderPath.map((step, index) => (
                <li
                  className="reveal-pop"
                  key={step}
                  style={{ transitionDelay: `${index * 140}ms` }}
                >
                  <span aria-hidden="true" className="about-path-nail">
                    {index + 1}
                  </span>
                  <span className="about-path-label">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="about-closing" data-purpose="about-community" id="community">
        <div className="about-closing-inner">
          <ScrollStatement />
          <div className="about-signoff reveal-up">
            <div aria-hidden="true" className="washi-tape-pink about-signoff-tape" />
            <p>
              <span className="about-signoff-brand">Klawseye.</span>{" "}
              <span className="about-signoff-line">KLAWS that are uniquely yours.</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
