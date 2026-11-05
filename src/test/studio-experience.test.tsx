import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { bookingEmailUrl, finishTime } from "@/components/storefront/studio-booking";
import { StudioExperience } from "@/components/storefront/studio-services";

const music = vi.hoisted(() => ({
  play: vi.fn(() => true),
  pause: vi.fn(),
  change: vi.fn(),
  setVolume: vi.fn(),
  destroy: vi.fn(),
}));

// jsdom has no Web Audio, so the page is tested against a stand-in player.
vi.mock("@/components/storefront/studio-music", () => ({
  StudioMusicPlayer: vi.fn(function () {
    return music;
  }),
}));

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("studio nail date", () => {
  it("works out when a treatment finishes", () => {
    expect(finishTime("3:00 PM", 140)).toBe("5:20 PM");
    expect(finishTime("11:00 AM", 90)).toBe("12:30 PM");
  });

  it("sends the studio every choice from the ticket", () => {
    const url = bookingEmailUrl({
      date: new Date(2026, 10, 15),
      time: "3:00 PM",
      treatment: { name: "Full Fantasy Sculpted Extensions", price: 3200, minutes: 140 },
      vibe: "Main Character",
      music: "Lo-fi city nights",
      matcha: false,
    });
    expect(
      url.startsWith("mailto:orders@klawseye.com?subject=Studio%20Booking%20Request&body="),
    ).toBe(true);
    const body = decodeURIComponent(url.split("&body=")[1]!);
    expect(body).toContain("I'd like to book Sunday, 15 November 2026 at 3:00 PM.");
    expect(body).toContain("Treatment: Full Fantasy Sculpted Extensions (₹3,200, 140 mins)");
    expect(body).toContain("Vibe: Main Character");
    expect(body).toContain("Music: Lo-fi city nights");
    expect(body).toContain("Fresh matcha: No thanks");
  });

  it("follows the vibe's suggestions until the client picks their own", () => {
    render(<StudioExperience />);
    const treatment = () => screen.getByTestId("ticket-treatment").textContent;
    const music = () => screen.getByTestId("ticket-music").textContent;

    fireEvent.click(screen.getByRole("radio", { name: /Main Character/ }));
    expect(treatment()).toBe("Full Fantasy Sculpted Extensions");
    expect(music()).toBe("Pop girlies, full volume");

    fireEvent.click(screen.getByRole("radio", { name: /Press-On Fitting/ }));
    fireEvent.click(screen.getByRole("radio", { name: "Lo-fi city nights" }));
    fireEvent.click(screen.getByRole("radio", { name: /Clean Girl/ }));
    expect(treatment()).toBe("Press-On Fitting & Consultation");
    expect(music()).toBe("Lo-fi city nights");
  });

  it("stays silent until play, follows the soundtrack, and stops on leaving", () => {
    const { unmount } = render(<StudioExperience />);
    expect(music.play).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("radio", { name: "Lo-fi city nights" }));
    expect(music.play).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    expect(music.play).toHaveBeenCalledWith("lofi");
    expect(screen.getByText("Now playing")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("radio", { name: "Pop girlies, full volume" }));
    expect(music.change).toHaveBeenLastCalledWith("pop");

    fireEvent.change(screen.getByRole("slider", { name: "Music volume" }), {
      target: { value: "25" },
    });
    expect(music.setVolume).toHaveBeenLastCalledWith(0.25);

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(music.pause).toHaveBeenCalled();

    unmount();
    expect(music.destroy).toHaveBeenCalled();
  });

  it("switches the studio lights", () => {
    const { container } = render(<StudioExperience />);
    const hero = container.querySelector(".studio-hero");
    const lights = screen.getByRole("button", { name: "Studio lights" });
    expect(hero).toHaveAttribute("data-lights", "on");
    fireEvent.click(lights);
    expect(hero).toHaveAttribute("data-lights", "off");
    expect(lights).toHaveAttribute("aria-pressed", "false");
  });

  it("only lets the slot be requested once a date and time are chosen", () => {
    render(<StudioExperience />);
    expect(screen.getByRole("button", { name: /REQUEST THIS SLOT/ })).toBeDisabled();
  });

  it("toggles the matcha on the ticket", () => {
    render(<StudioExperience />);
    const matcha = screen.getByRole("button", { name: /Fresh matcha/ });
    expect(matcha).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(matcha);
    expect(matcha).toHaveAttribute("aria-pressed", "false");
    expect(screen.getAllByText("No thanks").length).toBe(2);
  });
});
