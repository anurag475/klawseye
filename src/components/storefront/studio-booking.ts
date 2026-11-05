import { addMinutes, format, parse } from "date-fns";

export const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

/** Time a treatment finishes when it starts at one of the listed slots. */
export function finishTime(start: string, minutes: number) {
  return format(addMinutes(parse(start, "h:mm a", new Date(2026, 0, 1)), minutes), "h:mm a");
}

type BookingRequest = {
  date: Date;
  time: string;
  treatment: { name: string; price: number; minutes: number };
  vibe: string;
  music: string;
  matcha: boolean;
};

/** Email draft the studio receives when a client requests a slot. */
export function bookingEmailUrl({ date, time, treatment, vibe, music, matcha }: BookingRequest) {
  const body = [
    `I'd like to book ${format(date, "EEEE, d MMMM yyyy")} at ${time}.`,
    "",
    `Treatment: ${treatment.name} (${rupees(treatment.price)}, ${treatment.minutes} mins)`,
    `Vibe: ${vibe}`,
    `Music: ${music}`,
    `Fresh matcha: ${matcha ? "Yes please" : "No thanks"}`,
  ].join("\n");
  return `mailto:orders@klawseye.com?subject=${encodeURIComponent("Studio Booking Request")}&body=${encodeURIComponent(body)}`;
}
