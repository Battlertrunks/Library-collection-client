import { describe, it, expect, vi, afterEach } from "vitest";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

function Harness({ value }: { value: string }) {
  const debounced = useDebouncedValue(value, 300);
  return <p className="debounced-value">{debounced}</p>;
}

describe("useDebouncedValue", () => {
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

  function currentValue(): string {
    return container.querySelector(".debounced-value")!.textContent ?? "";
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
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    render(<Harness value="initial" />);

    expect(currentValue()).toBe("initial");
  });

  it("updates only after the delay has passed", () => {
    vi.useFakeTimers();
    render(<Harness value="first" />);

    act(() => {
      root.render(<Harness value="second" />);
    });
    expect(currentValue()).toBe("first");

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(currentValue()).toBe("first");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(currentValue()).toBe("second");
  });

  it("restarts the delay on rapid changes", () => {
    vi.useFakeTimers();
    render(<Harness value="a" />);

    act(() => {
      root.render(<Harness value="b" />);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      root.render(<Harness value="c" />);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(currentValue()).toBe("a");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(currentValue()).toBe("c");
  });
});
