import { describe, it, expect, vi, afterEach } from "vitest";
import { renderToString } from "react-dom/server";
import { createRoot, type Root } from "react-dom/client";
import { act, type ReactElement } from "react";
import CustomSelect from "./CustomSelect";
import { type Option } from "../../types/SelectOptions";

const mockOptions: Option[] = [
  { id: 1, label: "Option 1", value: "1" },
  { id: 2, label: "Option 2", value: "2" },
  { id: 3, label: "Option 3", value: "3" },
];

describe("CustomSelect", () => {
  it("renders the initial selected value", () => {
    const html = renderToString(<CustomSelect options={mockOptions} />);
    expect(html).toContain("Option 1");
  });

  it("renders all options in the dropdown list", () => {
    const html = renderToString(<CustomSelect options={mockOptions} />);
    mockOptions.forEach((option) => {
      expect(html).toContain(option.label);
    });
  });

  it("marks the first option as selected", () => {
    const html = renderToString(<CustomSelect options={mockOptions} />);
    const buttonMatch = html.match(/<button[\s\S]*?<\/button>/);
    expect(buttonMatch).not.toBeNull();
    expect(buttonMatch![0]).toContain("Option 1");
  });

  it("renders a button element", () => {
    const html = renderToString(<CustomSelect options={mockOptions} />);
    expect(html).toContain("<button");
  });

  it("renders a list element for the dropdown", () => {
    const html = renderToString(<CustomSelect options={mockOptions} />);
    expect(html).toContain("<ul");
  });

  describe("onChange", () => {
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

    function optionElement(label: string): HTMLElement {
      return Array.from(container.querySelectorAll("li")).find((li) =>
        li.textContent?.includes(label),
      )! as HTMLElement;
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
    });

    it("calls onChange with the selected option", () => {
      const onChange = vi.fn();
      render(<CustomSelect options={mockOptions} onChange={onChange} />);

      act(() => {
        (container.querySelector("button") as HTMLButtonElement).click();
      });
      act(() => {
        optionElement("Option 2").click();
      });

      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange).toHaveBeenCalledWith(mockOptions[1]);
    });

    it("does not call onChange while the dropdown is closed", () => {
      const onChange = vi.fn();
      render(<CustomSelect options={mockOptions} onChange={onChange} />);

      act(() => {
        optionElement("Option 2").click();
      });

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
