import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { format, getDay, isBefore, startOfDay } from "date-fns";
import { CalendarDays, Check, MapPin, Music2, Pause, Play, Sparkle, Volume2 } from "lucide-react";
import { StudioMusicPlayer, type TrackId } from "./studio-music";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { bookingEmailUrl, finishTime, rupees } from "./studio-booking";
import { DeskProps, HangingPlant, MirrorBulbs, PolishShelf } from "./studio-decor";

const treatments = [
  {
    id: "russian",
    name: "Dry Russian Manicure & Builder Gel",
    detail: "Deep e-file cuticle clean, nail plate architecture & strengthening.",
    price: 1800,
    minutes: 90,
  },
  {
    id: "fantasy",
    name: "Full Fantasy Sculpted Extensions",
    detail: "Hard gel extensions with freestyle 3D chrome, charms, and gems.",
    price: 3200,
    minutes: 140,
  },
  {
    id: "lashes",
    name: "Anime Wispy & Wet Lash Extensions",
    detail: "Featherlight spikes customized to complement your eye shape.",
    price: 2400,
    minutes: 120,
  },
  {
    id: "fitting",
    name: "Press-On Fitting & Consultation",
    detail: "Live measurement, cuticle preparation, and take-home adhesive kit.",
    price: 499,
    minutes: 30,
  },
];

const soundtracks: { id: TrackId; name: string }[] = [
  { id: "acoustic", name: "Slow-morning acoustic" },
  { id: "pop", name: "Pop girlies, full volume" },
  { id: "lofi", name: "Lo-fi city nights" },
  { id: "bollywood", name: "Bollywood throwbacks" },
];

// Each vibe restyles the page and suggests a treatment and soundtrack the client can still change.
const vibes = [
  {
    id: "clean",
    name: "Clean Girl",
    line: "Glossy, strong, quietly expensive.",
    treatmentId: "russian",
    soundtrackId: "acoustic",
    image: "/clients/client-01.jpg",
    set: "Blueberry polka French",
    alt: "Client wearing yellow polka-dot French tips with hand-painted blueberries",
    position: "50% 30%",
  },
  {
    id: "main",
    name: "Main Character",
    line: "3D chrome, charms, gems. Everyone asks.",
    treatmentId: "fantasy",
    soundtrackId: "pop",
    image: "/clients/client-06.jpg",
    set: "Petal & gold stilettos",
    alt: "Client wearing long nude stilettos with 3D pink petals, gold filigree and gemstones",
    position: "70% 35%",
  },
  {
    id: "dreamer",
    name: "Anime Dreamer",
    line: "Featherlight, wide-eyed, a little unreal.",
    treatmentId: "lashes",
    soundtrackId: "lofi",
    image: "/clients/client-05.jpg",
    set: "Chrome candy mix",
    alt: "Client wearing a mismatched set with chrome swirls, blue stars on black and silver-wired red and pink nails",
    position: "75% 45%",
  },
  {
    id: "press",
    name: "Press & Go",
    line: "Measured, fitted and out the door.",
    treatmentId: "fitting",
    soundtrackId: "bollywood",
    image: "/clients/client-08.jpg",
    set: "Sunny pop shorties",
    alt: "Client wearing short playful nails in teal, mustard and navy with 3D flowers, stars and polka dots",
    position: "50% 42%",
  },
];

const TIMES = ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];
const longestTreatment = Math.max(...treatments.map((treatment) => treatment.minutes));

// Demo availability: deterministic "booked" slots per date until a live schedule is connected.
function bookedFor(date: Date) {
  const seed = date.getDate() + date.getMonth() * 31;
  return TIMES.filter((_, i) => (seed * (i + 3)) % 4 === 0);
}
const unavailable = (d: Date) =>
  getDay(d) === 1 || isBefore(d, startOfDay(new Date())) || bookedFor(d).length === TIMES.length;

function Step({
  number,
  title,
  hint,
  children,
}: {
  number: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="studio-step">
      <div className="studio-step-head">
        <span aria-hidden="true" className="studio-step-nail">
          {number}
        </span>
        <div>
          <h2 className="studio-step-title">{title}</h2>
          {hint && <p className="studio-step-hint">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/** Build-your-nail-date flow: vibe and room up top, then treatment and slot beside a live ticket. */
export function StudioExperience() {
  const [vibeId, setVibeId] = useState(vibes[0]!.id);
  // Null means "follow the vibe's suggestion" until the client picks one themselves.
  const [pickedTreatment, setPickedTreatment] = useState<string | null>(null);
  const [pickedSoundtrack, setPickedSoundtrack] = useState<string | null>(null);
  const [matcha, setMatcha] = useState(true);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  // Dates depend on the visitor's locale and timezone, so the calendar only renders in the browser.
  const [calendarReady, setCalendarReady] = useState(false);
  useEffect(() => setCalendarReady(true), []);

  const vibe = vibes.find((item) => item.id === vibeId)!;
  const treatment = treatments.find((item) => item.id === (pickedTreatment ?? vibe.treatmentId))!;
  const soundtrack = soundtracks.find(
    (item) => item.id === (pickedSoundtrack ?? vibe.soundtrackId),
  )!;
  const booked = useMemo(() => (date ? bookedFor(date) : []), [date]);
  const ready = Boolean(date && time);

  const player = useRef<StudioMusicPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [lights, setLights] = useState(true);

  function togglePlaying() {
    if (playing) {
      player.current?.pause();
      setPlaying(false);
      return;
    }
    player.current ??= new StudioMusicPlayer();
    player.current.setVolume(volume / 100);
    setPlaying(player.current.play(soundtrack.id));
  }

  // Follow the chosen soundtrack, which changes with the vibe, while music is on.
  useEffect(() => {
    if (playing) player.current?.change(soundtrack.id);
  }, [playing, soundtrack.id]);

  // Go quiet while the tab is hidden, and pick up again on return.
  useEffect(() => {
    if (!playing) return;
    const onVisibility = () => {
      if (document.hidden) player.current?.pause();
      else player.current?.play(soundtrack.id);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing, soundtrack.id]);

  // Leaving the page stops the music.
  useEffect(
    () => () => {
      player.current?.destroy();
      player.current = null;
    },
    [],
  );

  const when =
    date && time
      ? `${format(date, "EEE, d MMM")} · ${time} – ${finishTime(time, treatment.minutes)}`
      : "";

  function requestSlot() {
    if (!date || !time) return;
    window.location.href = bookingEmailUrl({
      date,
      time,
      treatment,
      vibe: vibe.name,
      music: soundtrack.name,
      matcha,
    });
  }

  return (
    <div className="studio-experience" data-vibe={vibe.id}>
      <section
        className="studio-hero"
        data-lights={lights ? "on" : "off"}
        data-purpose="in-studio-services"
        id="services"
      >
        <div className="studio-wall">
          <HangingPlant />
          <div className="studio-wall-grid">
            <div className="studio-hero-copy">
              <p className="studio-badge">
                <MapPin aria-hidden="true" />
                DELHI-NCR STUDIO
              </p>
              <h1 className="studio-title">Your nail date starts here.</h1>
              <p className="studio-lede">
                <span aria-hidden="true" className="washi-tape-pink studio-lede-tape" />
                Step into our cozy Delhi-NCR private studio. Relax with fresh matcha, customized
                music, and 1-on-1 artistic nail and lash care tailored specifically to your natural
                anatomy.
              </p>

              <fieldset className="studio-vibes">
                <legend className="font-handwritten">What’s the vibe today?</legend>
                <div className="studio-vibe-grid">
                  {vibes.map((item) => (
                    <label
                      className="studio-vibe"
                      data-selected={item.id === vibe.id || undefined}
                      key={item.id}
                    >
                      <input
                        checked={item.id === vibe.id}
                        className="sr-only"
                        name="studio-vibe"
                        onChange={() => setVibeId(item.id)}
                        type="radio"
                      />
                      <span className="studio-vibe-name">{item.name}</span>
                      <span className="studio-vibe-line">{item.line}</span>
                      <span aria-hidden="true" className="studio-vibe-check">
                        <Check />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <a
                className="inline-flex items-center gap-2 bg-brandBlue text-primary-foreground font-body font-bold text-sm px-8 py-3.5 rounded-full border-2 border-brandBlue shadow-sticker hover:bg-brandRose transition-all"
                href="#book"
              >
                <span>BOOK AN APPOINTMENT</span>
                <CalendarDays aria-hidden="true" className="w-4 h-4" />
              </a>
            </div>

            <div className="studio-wall-feature">
              <p aria-hidden="true" className="studio-neon" key={vibe.id}>
                {vibe.name}
              </p>
              <figure className="studio-mirror" key={vibe.image}>
                <MirrorBulbs />
                <span className="studio-mirror-glass">
                  <img
                    alt={vibe.alt}
                    decoding="async"
                    src={vibe.image}
                    style={{ objectPosition: vibe.position }}
                  />
                </span>
                <figcaption className="font-handwritten">{vibe.set}</figcaption>
                <span aria-hidden="true" className="studio-burst">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Sparkle
                      fill="currentColor"
                      key={index}
                      style={{ rotate: `${index * 60}deg` }}
                    />
                  ))}
                </span>
              </figure>

              <div className="studio-wall-side">
                <button
                  aria-label="Studio lights"
                  aria-pressed={lights}
                  className="studio-switch"
                  onClick={() => setLights((value) => !value)}
                  type="button"
                >
                  <span aria-hidden="true" className="studio-switch-plate">
                    <span className="studio-switch-rocker" />
                  </span>
                  <span aria-hidden="true" className="studio-switch-text">
                    Lights {lights ? "on" : "off"}
                  </span>
                </button>
                <p className="studio-frame">
                  <span>Certified Techs Only</span>
                </p>
                <p className="studio-door-sign font-handwritten">Closed Mondays</p>
              </div>

              <PolishShelf />
            </div>
          </div>
        </div>

        <div className="studio-desk">
          <div className="studio-desk-top">
            <button
              aria-label={`${playing ? "Pause" : "Play"} ${soundtrack.name} on the turntable`}
              className="studio-turntable"
              data-playing={playing || undefined}
              onClick={togglePlaying}
              type="button"
            >
              <span className="studio-vinyl">
                <span className="studio-vinyl-label" />
              </span>
              <span className="studio-tonearm" />
            </button>

            <div className="studio-console">
              <div className="studio-transport" data-playing={playing || undefined}>
                <button className="studio-play" onClick={togglePlaying} type="button">
                  {playing ? (
                    <Pause aria-hidden="true" fill="currentColor" />
                  ) : (
                    <Play aria-hidden="true" fill="currentColor" />
                  )}
                  {playing ? "Pause" : "Play"}
                </button>
                <span aria-hidden="true" className="studio-eq">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                <p className="studio-now-playing">
                  <span>{playing ? "Now playing" : "Tap play to hear it"}</span>
                  <strong>{soundtrack.name}</strong>
                </p>
                <label className="studio-volume">
                  <Volume2 aria-hidden="true" />
                  <span className="sr-only">Music volume</span>
                  <input
                    max={100}
                    min={0}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setVolume(value);
                      player.current?.setVolume(value / 100);
                    }}
                    type="range"
                    value={volume}
                  />
                </label>
              </div>

              <fieldset className="studio-speakers">
                <legend>
                  <Music2 aria-hidden="true" />
                  ON THE SPEAKERS
                </legend>
                <div className="studio-speaker-chips">
                  {soundtracks.map((item) => (
                    <label
                      className="studio-chip"
                      data-selected={item.id === soundtrack.id || undefined}
                      key={item.id}
                    >
                      <input
                        checked={item.id === soundtrack.id}
                        className="sr-only"
                        name="studio-soundtrack"
                        onChange={() => setPickedSoundtrack(item.id)}
                        type="radio"
                      />
                      {item.name}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <button
              aria-pressed={matcha}
              className="studio-matcha"
              onClick={() => setMatcha((value) => !value)}
              type="button"
            >
              <span aria-hidden="true" className="studio-matcha-glass">
                <span className="studio-matcha-straw" />
                <span className="studio-matcha-fill" />
              </span>
              <span className="studio-matcha-text">
                <span>Fresh matcha</span>
                <strong>{matcha ? "Yes please" : "No thanks"}</strong>
              </span>
            </button>

            <DeskProps />
          </div>
        </div>
      </section>

      <section className="studio-plan" id="book">
        <div className="studio-plan-grid">
          <div className="studio-plan-steps">
            <Step hint="Certified Techs Only ✨" number={1} title="Delhi Studio Menu">
              <div aria-label="Delhi studio menu" className="studio-menu" role="radiogroup">
                {treatments.map((item) => (
                  <label
                    className="studio-treatment"
                    data-selected={item.id === treatment.id || undefined}
                    key={item.id}
                  >
                    <input
                      checked={item.id === treatment.id}
                      className="sr-only"
                      name="studio-treatment"
                      onChange={() => setPickedTreatment(item.id)}
                      type="radio"
                    />
                    <span aria-hidden="true" className="studio-treatment-tick">
                      <Check />
                    </span>
                    <span className="studio-treatment-body">
                      <span className="studio-treatment-name">
                        {item.name}
                        {item.id === vibe.treatmentId && (
                          <span className="studio-match">{vibe.name} pick</span>
                        )}
                      </span>
                      <span className="studio-treatment-detail">{item.detail}</span>
                      <span aria-hidden="true" className="studio-treatment-time">
                        <span style={{ width: `${(item.minutes / longestTreatment) * 100}%` }} />
                      </span>
                    </span>
                    <span className="studio-treatment-price">
                      <strong>{rupees(item.price)}</strong>
                      <span>{item.minutes} mins</span>
                    </span>
                  </label>
                ))}
              </div>
            </Step>

            <Step
              hint="Pick a date to see remaining slots. Closed Mondays."
              number={2}
              title="Book a Studio Slot"
            >
              <div className="studio-slot-grid">
                <div className="studio-calendar">
                  {calendarReady && (
                    <Calendar
                      className="p-2 pointer-events-auto bg-transparent"
                      disabled={unavailable}
                      mode="single"
                      onSelect={(value) => {
                        setDate(value);
                        setTime("");
                      }}
                      selected={date}
                    />
                  )}
                </div>
                <div className="studio-slots">
                  {!date ? (
                    <p className="studio-slots-empty">Choose a date to view available times.</p>
                  ) : (
                    <>
                      <h3 className="studio-slots-date">{format(date, "EEE, d MMM")}</h3>
                      <p className="studio-slots-left">
                        {TIMES.length - booked.length} of {TIMES.length} slots remaining
                      </p>
                      <div className="studio-slot-list">
                        {TIMES.map((slot) => {
                          const taken = booked.includes(slot);
                          return (
                            <button
                              aria-pressed={time === slot}
                              className="studio-slot"
                              disabled={taken}
                              key={slot}
                              onClick={() => setTime(slot)}
                              type="button"
                            >
                              {slot}
                              {taken ? " · BOOKED" : ""}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Step>
          </div>

          <aside
            aria-label="Your nail date"
            className="studio-ticket"
            data-ready={ready || undefined}
          >
            <div className="studio-ticket-head">
              <p className="studio-ticket-kicker font-handwritten">admit one · 1-on-1</p>
              <h2 className="studio-ticket-title">Your nail date</h2>
              {ready && (
                <span aria-hidden="true" className="studio-ticket-stamp">
                  Date set
                </span>
              )}
            </div>
            <dl className="studio-ticket-rows">
              <div>
                <dt>Vibe</dt>
                <dd>{vibe.name}</dd>
              </div>
              <div>
                <dt>Treatment</dt>
                <dd data-testid="ticket-treatment">{treatment.name}</dd>
              </div>
              <div>
                <dt>When</dt>
                <dd>{when || "Pick a date and time"}</dd>
              </div>
              <div>
                <dt>Music</dt>
                <dd data-testid="ticket-music">{soundtrack.name}</dd>
              </div>
              <div>
                <dt>Fresh matcha</dt>
                <dd>{matcha ? "Yes please" : "No thanks"}</dd>
              </div>
            </dl>
            <div className="studio-ticket-total">
              <span>{treatment.minutes} mins</span>
              <strong>{rupees(treatment.price)}</strong>
            </div>
            <Button className="shop-action w-full" disabled={!ready} onClick={requestSlot}>
              REQUEST THIS SLOT ✨
            </Button>
            <p className="studio-ticket-note">
              Prepaid advance required to hold slot. The studio confirms your slot by email. Exact
              studio address sent via WhatsApp upon confirmation.
            </p>
            <p className="sr-only" role="status">
              {ready ? `Your nail date is set for ${when}.` : ""}
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
