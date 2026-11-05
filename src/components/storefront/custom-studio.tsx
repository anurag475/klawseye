import type { PointerEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Gem, MessageCircle, Ruler, WandSparkles } from "lucide-react";
import {
  formatPrice,
  preparationTime,
  preparationTimeBusy,
  productSlug,
  sizingKit,
} from "./products";

const pins = [
  {
    look: "cyber",
    lookName: "Cyber Chrome",
    image: "/clients/client-05.jpg",
    set: "Chrome candy mix",
    position: "75% 45%",
    alt: "Client wearing a mismatched set with chrome swirls, blue stars on black and silver-wired red and pink nails",
  },
  {
    look: "cottage",
    lookName: "Cottagecore",
    image: "/clients/client-03.jpg",
    set: "Garden party mix & match",
    position: "50% 38%",
    alt: "Client showing a mismatched set of butterflies, chrome stars and jelly swirls",
  },
  {
    look: "gothic",
    lookName: "Gothic Tears",
    image: "/clients/client-07.jpg",
    set: "Cherry heart cat-eye",
    position: "55% 42%",
    alt: "Client wearing cherry red cat-eye almonds with gold crosses, hearts and stars",
  },
];

// Pinned photos tilt towards the pointer under a sliding glare (after 21st.dev's
// Tilt Card). Measured on the <li>, which never moves, so the tilt can't feed back
// into its own position.
function tiltPin(event: PointerEvent<HTMLLIElement>) {
  if (
    event.pointerType !== "mouse" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const box = event.currentTarget.getBoundingClientRect();
  const tx = ((event.clientX - box.left) / box.width) * 2 - 1;
  const ty = ((event.clientY - box.top) / box.height) * 2 - 1;
  event.currentTarget.style.setProperty("--tx", Math.max(-1, Math.min(1, tx)).toFixed(3));
  event.currentTarget.style.setProperty("--ty", Math.max(-1, Math.min(1, ty)).toFixed(3));
}

function settlePin(event: PointerEvent<HTMLLIElement>) {
  event.currentTarget.style.removeProperty("--tx");
  event.currentTarget.style.removeProperty("--ty");
}

/** Opening of the Custom Sets page: the pitch, a board of real sets that load looks into the designer, and how it works. */
export function CustomStudioIntro({ onLook }: { onLook: (id: string) => void }) {
  return (
    <section className="custom-hero" data-purpose="custom-order-flow" id="custom-studio">
      <div className="custom-hero-grid">
        <div className="custom-hero-copy">
          <span className="custom-kicker">BESPOKE NAIL ARCHITECTURE</span>
          <h1 className="custom-title">
            Your vision. <span className="hero-scribble">Your Klaws.</span>
          </h1>
          <p className="custom-lede">
            Saved an intricate look that no standard store sells? Whether it&apos;s metallic cyber
            charms, delicate cottagecore cherries, or gothic blood tears, we bring your wildest hand
            concepts into wearable art.
          </p>
          <div className="custom-perks">
            <div className="custom-perk">
              <Ruler aria-hidden="true" />
              <h2>PERFECT 1:1 FIT</h2>
              <p>Guaranteed fit from thumb to pinky with millimeter precision.</p>
            </div>
            <div className="custom-perk">
              <Gem aria-hidden="true" />
              <h2>DURABLE BUILD</h2>
              <p>Layered salon builder gel that resists chipping and snaps.</p>
            </div>
          </div>
          <div className="custom-cta-row">
            <a className="hero-v2-cta-alt custom-cta-main" href="#designer">
              <WandSparkles aria-hidden="true" className="w-4 h-4" />
              DESIGN YOUR OWN
            </a>
            <a
              className="hero-v2-cta-alt"
              href="https://www.instagram.com/klawseye/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" className="w-4 h-4" />
              DM TO CUSTOMISE ON INSTAGRAM
            </a>
          </div>
          <p className="custom-email">Or email your inspo images to orders@klawseye.com</p>
        </div>

        <div className="custom-board">
          <p className="custom-board-title font-handwritten">Real sets. Tap one to try the vibe.</p>
          <ul className="custom-pins">
            {pins.map((pin) => (
              <li key={pin.look} onPointerLeave={settlePin} onPointerMove={tiltPin}>
                <a
                  aria-label={`${pin.set}: try the ${pin.lookName} look in the designer`}
                  className="custom-pin"
                  href="#designer"
                  onClick={() => onLook(pin.look)}
                >
                  <span aria-hidden="true" className="custom-pin-head" />
                  <span className="custom-pin-photo">
                    <img
                      alt={pin.alt}
                      decoding="async"
                      src={pin.image}
                      style={{ objectPosition: pin.position }}
                    />
                    <span aria-hidden="true" className="custom-pin-glare" />
                  </span>
                  <span className="custom-pin-set font-handwritten">{pin.set}</span>
                  <span className="custom-pin-try">
                    <WandSparkles aria-hidden="true" />
                    {`Try ${pin.lookName}`}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="custom-kit">
        <div className="custom-kit-head">
          <h2>CUSTOM MOODBOARD KIT</h2>
          <span className="font-handwritten">Step-by-step guide</span>
        </div>
        <ol className="custom-kit-steps">
          <li>
            <span aria-hidden="true" className="custom-kit-nail">
              1
            </span>
            <h3>Snap or Save Your Inspo</h3>
            <p>Send us screenshots from Pinterest, TikTok, or our Instagram feed.</p>
          </li>
          <li>
            <span aria-hidden="true" className="custom-kit-nail">
              2
            </span>
            <h3>Measure With Sizing Coin</h3>
            <p>
              Place a 5-rupee coin next to your bare hand or order our{" "}
              <Link
                params={{ slug: productSlug(sizingKit) }}
                to="/set/$slug"
              >{`${formatPrice(sizingKit.price)} sizing kit`}</Link>
              .
            </p>
          </li>
          <li>
            <span aria-hidden="true" className="custom-kit-nail">
              3
            </span>
            <h3>Pick Your Shape, Shades &amp; Charms</h3>
            <p>
              Choose your shades and browse our charms.{" "}
              <a href="#designer">Try them in the designer ↓</a>
            </p>
          </li>
          <li>
            <span aria-hidden="true" className="custom-kit-nail">
              4
            </span>
            <h3>Handmade to Order &amp; Shipped Pan-India</h3>
            <p>{`Crafted with certified UV gel formulas over ${preparationTime} (${preparationTimeBusy} in busy periods), then shipped.`}</p>
          </li>
        </ol>
        <p className="custom-kit-quote font-handwritten">
          &quot;No generic factory molds. Ever.&quot;
        </p>
      </div>
    </section>
  );
}
