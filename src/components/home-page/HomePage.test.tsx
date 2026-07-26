import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("renders the greeting with username", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("BattlerTrunks");
  });

  it("renders the text overlay percentages", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("52%");
    expect(html).toContain("You Own");
    expect(html).toContain("of the Series");
  });

  it("renders the ProgressChart component", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("arc-progress-wrapper");
  });

  it("renders the 'Progress so far...' section heading", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("Progress so far");
  });

  it("renders all three BooksWidget items", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("Books Collected");
    expect(html).toContain("Series Completed");
    expect(html).toContain("Upcoming Releases");
  });

  it("renders the FeaturedBook section", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("Book of the Day");
    expect(html).toContain("The Horus Heresy: Know No Fear");
    expect(html).toContain("Dan Abnett");
  });

  it("renders horizontal rule separators", () => {
    const html = renderToString(<HomePage />);
    const hrMatches = html.match(/<hr/g);
    expect(hrMatches).toHaveLength(2);
  });

  it("renders the BooksWidget authors", () => {
    const html = renderToString(<HomePage />);
    expect(html).toContain("Aron Dembski-Bowden");
    expect(html).toContain("Bob");
    expect(html).toContain("Alice");
  });
});
