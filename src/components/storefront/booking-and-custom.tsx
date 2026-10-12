import { useMemo, useState, type FormEvent } from "react";
import { format, isBefore, startOfDay, getDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const TIMES = ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];
// Demo availability: deterministic "booked" slots per date until a live schedule is connected.
function bookedFor(date: Date) {
  const seed = date.getDate() + date.getMonth() * 31;
  return TIMES.filter((_, i) => (seed * (i + 3)) % 4 === 0);
}
const closed = (d: Date) => getDay(d) === 1 || isBefore(d, startOfDay(new Date()));

export function BookingAndCustom() {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const booked = useMemo(() => (date ? bookedFor(date) : []), [date]);
  const fullyBooked = (d: Date) => bookedFor(d).length === TIMES.length;

  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  function book() {
    if (!date || !time) return;
    window.location.href = `mailto:orders@klawseye.com?subject=${encodeURIComponent("Studio Booking Request")}&body=${encodeURIComponent(`I'd like to book ${format(date, "EEEE, d MMMM yyyy")} at ${time}.`)}`;
  }
  function submitCustom(e: FormEvent) {
    e.preventDefault();
    const url = link.trim();
    if (url && !/^https?:\/\/\S+$/i.test(url)) return setError("Please add a valid link starting with https://");
    if (!url && !fileName) return setError("Add an inspiration photo or link.");
    if (!notes.trim()) return setError("Tell us your requirements.");
    if (notes.length > 1500) return setError("Please keep instructions under 1500 characters.");
    setError("");
    const body = `Inspiration link: ${url || "—"}\nInspiration photo: ${fileName ? `${fileName} (attached)` : "—"}\n\nRequirements:\n${notes.trim()}`;
    window.location.href = `mailto:orders@klawseye.com?subject=${encodeURIComponent("Custom Nail Set Request")}&body=${encodeURIComponent(body)}`;
  }

  return <>
    <section id="book" className="py-20 bg-gingham-blue border-y-2 border-brandBlue">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl text-brandBlue text-center mb-2">BOOK A STUDIO SLOT</h2>
        <p className="text-center text-copy mb-10">Pick a date to see remaining slots. Closed Mondays.</p>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="bg-card border-2 border-brandBlue rounded-xl shadow-sticker p-2 flex justify-center">
            <Calendar mode="single" selected={date} onSelect={d => { setDate(d); setTime(""); }} disabled={d => closed(d) || fullyBooked(d)} className="p-3 pointer-events-auto" />
          </div>
          <div className="bg-card border-2 border-brandBlue rounded-xl shadow-sticker p-6">
            {!date ? <p className="text-copy">Choose a date to view available times.</p> : <>
              <h3 className="font-display text-xl text-brandBlue">{format(date, "EEE, d MMM")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{TIMES.length - booked.length} of {TIMES.length} slots remaining</p>
              <div className="grid grid-cols-2 gap-3">
                {TIMES.map(t => { const taken = booked.includes(t); return <button key={t} type="button" disabled={taken} onClick={() => setTime(t)} className={`filter-button ${time === t ? "filter-active" : ""} ${taken ? "opacity-40 line-through cursor-not-allowed" : ""}`}>{t}{taken ? " · BOOKED" : ""}</button>; })}
              </div>
              <Button className="shop-action w-full mt-6" disabled={!time} onClick={book}>REQUEST THIS SLOT ✨</Button>
              <p className="text-xs text-muted-foreground mt-2">Prepaid advance required. The studio confirms your slot by email.</p>
            </>}
          </div>
        </div>
      </div>
    </section>

    <section id="customise" className="py-20 bg-brandSoftWhite">
      <form onSubmit={submitCustom} className="max-w-2xl mx-auto px-4 space-y-5">
        <h2 className="font-display text-3xl md:text-4xl text-brandBlue text-center">CUSTOMISE YOUR OWN SET</h2>
        <p className="text-center text-copy">Share your inspiration and we'll handcraft it for you.</p>
        <label className="block font-semibold text-brandBlue">Upload inspiration
          <input type="file" accept="image/*" className="shop-input mt-2" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 10 * 1024 * 1024) { setError("Image must be under 10MB."); return; } setFileName(f.name); setPreview(URL.createObjectURL(f)); }} />
        </label>
        {preview && <img src={preview} alt="Your inspiration" className="w-40 h-40 object-cover rounded-xl border-2 border-brandBlue shadow-sticker" />}
        <label className="block font-semibold text-brandBlue">Pinterest / inspiration link
          <input type="url" maxLength={500} className="shop-input mt-2" placeholder="https://pin.it/…" value={link} onChange={e => setLink(e.target.value)} />
        </label>
        <label className="block font-semibold text-brandBlue">Your requirements
          <textarea maxLength={1500} rows={5} className="shop-input mt-2 !rounded-2xl" placeholder="Shape, length, colours, charms, size…" value={notes} onChange={e => setNotes(e.target.value)} />
        </label>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <Button type="submit" className="shop-action w-full">SEND MY DESIGN REQUEST 💅</Button>
        {fileName && <p className="text-xs text-muted-foreground">Your email app will open — please attach {fileName} before sending.</p>}
      </form>
    </section>
  </>;
}
