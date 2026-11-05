import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CustomRequestForm } from "@/components/storefront/booking-and-custom";
import { charmOptions, shades } from "@/components/storefront/design-options";
import {
  charmFor,
  charmNail,
  describeDesign,
  initialDesign,
  looks,
  paintNail,
  shadeIdFor,
} from "@/components/storefront/nail-design";
import { NailDesigner } from "@/components/storefront/nail-designer";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));
afterEach(cleanup);

describe("nail design model", () => {
  it("paints one nail without touching the others, and unpaints on a second tap", () => {
    const painted = paintNail(initialDesign, 0, "solid-cherry");
    expect(shadeIdFor(painted, 0)).toBe("solid-cherry");
    expect(shadeIdFor(painted, 1)).toBe(shadeIdFor(initialDesign, 1));
    expect(paintNail(painted, 0, "solid-cherry").overrides).toEqual({});
  });

  it("lets one nail swap or lose its charm", () => {
    const swapped = charmNail(initialDesign, 1, "heart");
    expect(charmFor(swapped, 1)?.id).toBe("heart");
    expect(charmFor(charmNail(swapped, 1, "heart"), 1)).toBeNull();
  });

  it("spells out single-nail choices for the studio", () => {
    const brief = describeDesign(charmNail(paintNail(initialDesign, 3, "solid-cherry"), 3, "bow"));
    expect(brief).toContain("• Ring: Cherry, Bow charm");
  });

  it("only offers looks made from real shades and charms", () => {
    for (const { design } of looks) {
      for (const id of design.shades) expect(shades.some((shade) => shade.id === id)).toBe(true);
      for (const id of design.charms)
        expect(charmOptions.some((charm) => charm.id === id)).toBe(true);
    }
  });
});

describe("designer", () => {
  it("steps through the options and sends the painted design", () => {
    const onUseDesign = vi.fn();
    render(<NailDesigner onUseDesign={onUseDesign} />);
    fireEvent.click(screen.getByRole("button", { name: /^Next: Length/ }));
    fireEvent.click(screen.getByRole("button", { name: "Long" }));

    fireEvent.click(screen.getByRole("button", { name: "Thumb" }));
    expect(screen.getByText("Painting the thumb nail only.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Cherry" }));

    fireEvent.click(screen.getByRole("button", { name: /SEND THIS DESIGN/ }));
    const sent = onUseDesign.mock.calls[0]![0];
    expect(sent.length).toBe(2);
    expect(shadeIdFor(sent, 0)).toBe("solid-cherry");
    expect(shadeIdFor(sent, 1)).toBe("solid-navy");
  });

  it("undoes the last change", () => {
    const onUseDesign = vi.fn();
    render(<NailDesigner onUseDesign={onUseDesign} />);
    const undo = screen.getByRole("button", { name: /UNDO/ });
    expect(undo).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "stiletto" }));
    fireEvent.click(undo);
    fireEvent.click(screen.getByRole("button", { name: /SEND THIS DESIGN/ }));
    expect(onUseDesign.mock.calls[0]![0].shape).toBe("almond");
  });

  it("deals a look tapped on the corkboard", () => {
    const onUseDesign = vi.fn();
    render(<NailDesigner look={{ id: "gothic", count: 1 }} onUseDesign={onUseDesign} />);
    fireEvent.click(screen.getByRole("button", { name: /SEND THIS DESIGN/ }));
    expect(onUseDesign.mock.calls[0]![0].shape).toBe("stiletto");
  });
});

describe("request form", () => {
  it("asks for inspiration when there is no design, photo or link", () => {
    render(<CustomRequestForm />);
    fireEvent.click(screen.getByRole("button", { name: /SEND MY DESIGN REQUEST/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("Add an inspiration photo or link.");
  });

  it("rejects files that are not images", () => {
    render(<CustomRequestForm />);
    const input = screen.getByLabelText("Upload inspiration");
    fireEvent.change(input, {
      target: { files: [new File(["x"], "notes.txt", { type: "text/plain" })] },
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Please choose an image file.");
  });

  it("fills the requirements from a sent design and shows its preview", () => {
    render(<CustomRequestForm brief="My design" design={initialDesign} sent={1} />);
    expect(screen.getByLabelText(/Your requirements/)).toHaveValue("My design\n\nSize: ");
    expect(screen.getByRole("img", { name: /^Preview:/ })).toBeInTheDocument();
  });
});
