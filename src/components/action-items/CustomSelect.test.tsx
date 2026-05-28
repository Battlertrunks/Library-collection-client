import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
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
});
