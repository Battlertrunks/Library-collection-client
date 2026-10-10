import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import EndOfListMessage from "./EndOfListMessage";

describe("EndOfListMessage", () => {
  let container: HTMLDivElement;
  let root: Root;

  function render(ui: ReactElement) {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
      root.render(ui);
    });
  }

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    if (container?.parentNode) {
      container.parentNode.removeChild(container);
    }
    vi.restoreAllMocks();
  });

  it("renders the end message", () => {
    const html = renderToString(<EndOfListMessage />);

    expect(html).toContain("You have reached the end 🥳");
    expect(html).toContain("end-of-list");
  });

  it("fades in based on how far the message has scrolled into view", () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(
      (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    );
    const rectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect");
    const viewportHeight = window.innerHeight;

    rectSpy.mockReturnValue({
      top: viewportHeight - 60,
    } as DOMRect);
    render(<EndOfListMessage />);

    const message = container.querySelector(".end-of-list") as HTMLElement;
    expect(Number(message.style.opacity)).toBeCloseTo(0.5);

    rectSpy.mockReturnValue({
      top: viewportHeight - 120,
    } as DOMRect);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(Number(message.style.opacity)).toBeCloseTo(1);
  });
});
