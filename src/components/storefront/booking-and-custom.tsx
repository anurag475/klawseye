import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { ImagePlus, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Design } from "./nail-design";
import { NailTray } from "./nail-designer";
import { preparationTime, preparationTimeBusy } from "./products";

const MAX_NOTES = 1500;

export function CustomRequestForm({
  brief = "",
  sent = 0,
  design,
}: {
  brief?: string;
  sent?: number;
  design?: Design | undefined;
}) {
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  // A design sent from the nail designer replaces the requirements text.
  useEffect(() => {
    if (sent) setNotes(`${brief}\n\nSize: `);
  }, [brief, sent]);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  // Release the previewed photo when it is replaced or the page closes.
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function chooseFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 10 * 1024 * 1024) return setError("Image must be under 10MB.");
    setError("");
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
  }

  function removeFile() {
    setFileName("");
    setPreview("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function dropFile(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  function submitCustom(e: FormEvent) {
    e.preventDefault();
    const url = link.trim();
    if (url && !/^https?:\/\/\S+$/i.test(url))
      return setError("Please add a valid link starting with https://");
    if (!url && !fileName && !design) return setError("Add an inspiration photo or link.");
    if (!notes.trim()) return setError("Tell us your requirements.");
    if (notes.length > MAX_NOTES)
      return setError("Please keep instructions under 1500 characters.");
    setError("");
    const body = `Inspiration link: ${url || "—"}\nInspiration photo: ${fileName ? `${fileName} (attached)` : "—"}\n\nRequirements:\n${notes.trim()}`;
    window.location.href = `mailto:orders@klawseye.com?subject=${encodeURIComponent("Custom Nail Set Request")}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section className="custom-send" id="customise">
      <div className="custom-send-head">
        <h2>CUSTOMISE YOUR OWN SET</h2>
        <p>
          Share your inspiration and we&apos;ll handcraft it for you. Custom sets take{" "}
          {preparationTime} to make ({preparationTimeBusy} in busy periods).
        </p>
      </div>

      <div className="custom-send-grid">
        <aside aria-label="Your design" className="custom-ticket">
          <p className="custom-ticket-kicker font-handwritten">
            {design ? "your set is on the table" : "the table is empty"}
          </p>
          {design ? (
            <div className="custom-ticket-tray" key={sent}>
              <NailTray design={design} spin={sent} />
            </div>
          ) : (
            <div className="custom-ticket-empty">
              <p>No design yet? Build one in the designer and it lands here.</p>
              <a className="hero-v2-cta-alt" href="#designer">
                OPEN THE DESIGNER
              </a>
            </div>
          )}
          {design && (
            <a className="custom-ticket-edit" href="#designer">
              Change something
            </a>
          )}
        </aside>

        <form className="custom-form" noValidate onSubmit={submitCustom}>
          <div className="custom-field">
            <span className="custom-label" id="custom-photo-label">
              Upload inspiration
            </span>
            {preview ? (
              <figure className="custom-preview">
                <img alt="Your inspiration" src={preview} />
                <figcaption>{fileName}</figcaption>
                <button aria-label={`Remove ${fileName}`} onClick={removeFile} type="button">
                  <X aria-hidden="true" />
                </button>
              </figure>
            ) : null}
            <label
              className="custom-drop"
              data-dragging={dragging || undefined}
              data-compact={preview ? true : undefined}
              onDragLeave={() => setDragging(false)}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDrop={dropFile}
            >
              <input
                accept="image/*"
                aria-labelledby="custom-photo-label"
                className="sr-only"
                onChange={(event) => chooseFile(event.target.files?.[0])}
                ref={fileInput}
                type="file"
              />
              <ImagePlus aria-hidden="true" />
              <strong>
                {preview ? "Choose a different photo" : "Tap to choose a photo, or drop it here"}
              </strong>
              {!preview && <span>Screenshots welcome. Images up to 10MB.</span>}
            </label>
          </div>

          <label className="custom-field">
            <span className="custom-label">Pinterest / inspiration link</span>
            <span className="custom-input-wrap">
              <Link2 aria-hidden="true" />
              <input
                className="shop-input"
                maxLength={500}
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://pin.it/…"
                type="url"
                value={link}
              />
            </span>
          </label>

          <label className="custom-field">
            <span className="custom-label-row">
              <span className="custom-label">Your requirements</span>
              <span
                className="custom-count"
                data-near={notes.length > MAX_NOTES - 100 || undefined}
              >
                {notes.length} / {MAX_NOTES}
              </span>
            </span>
            <textarea
              className="shop-input !rounded-2xl"
              id="custom-requirements"
              maxLength={MAX_NOTES}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Shape, length, colours, charms, size…"
              rows={7}
              value={notes}
            />
          </label>

          {error && (
            <p className="custom-error" role="alert">
              {error}
            </p>
          )}
          <Button className="shop-action w-full" type="submit">
            SEND MY DESIGN REQUEST 💅
          </Button>
          {fileName && (
            <p className="custom-attach-note">
              Your email app will open — please attach {fileName} before sending.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
