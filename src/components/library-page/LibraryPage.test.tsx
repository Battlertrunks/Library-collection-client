import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import LibraryPage from "./LibraryPage";

describe("LibraryPage", () => {
  it("renders the heading 'Your Collection'", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain("Your Collection");
  });

  it("renders the subheading 'Thus Far'", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain("Thus Far");
  });

  it("renders the search label", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain("Search:");
  });

  it("renders a search input with placeholder text", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain('placeholder="Looking for..."');
  });

  it("renders the sort label", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain("Sort By:");
  });

  it("renders the CustomSelect component with sort options", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain("Recently Added");
    expect(html).toContain("Name A to Z");
    expect(html).toContain("Name Z to A");
    expect(html).toContain("Date Published");
    expect(html).toContain("Completion");
  });

  it("renders the search input with search-inp class", () => {
    const html = renderToString(<LibraryPage />);
    expect(html).toContain("search-inp");
  });
});
