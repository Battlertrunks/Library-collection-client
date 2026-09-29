import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import FeaturedBook from "./FeaturedBook";

describe("FeaturedBook", () => {
  it("renders the 'Book of the Day' heading", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain("Book of the Day");
  });

  it("renders the book title", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain("The Horus Heresy: Know No Fear");
  });

  it("renders the author with 'by' prefix", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain("Dan Abnett");
    expect(html).toContain("by");
  });

  it("renders the publish year", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain("2019");
  });

  it("renders the cover image with correct alt text", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain('alt="Books Widget"');
  });

  it("renders the cover image with the featured-book__cover class", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain("featured-book__cover");
  });

  it("renders the outer container with mt-10 class", () => {
    const html = renderToString(<FeaturedBook />);
    expect(html).toContain('class="mt-10"');
  });
});
