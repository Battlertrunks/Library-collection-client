import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import BooksWidget from "./BooksWidget";

const defaultProps = {
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  completionAmount: 65,
};

describe("BooksWidget", () => {
  it("renders the title", () => {
    const html = renderToString(<BooksWidget {...defaultProps} />);
    expect(html).toContain("The Great Gatsby");
  });

  it("renders the author", () => {
    const html = renderToString(<BooksWidget {...defaultProps} />);
    expect(html).toContain("F. Scott Fitzgerald");
  });

  it("renders the completion percentage text", () => {
    const html = renderToString(<BooksWidget {...defaultProps} />);
    expect(html).toContain("% Complete");
  });

  it("renders the progress bar with correct width", () => {
    const html = renderToString(<BooksWidget {...defaultProps} />);
    const match = html.match(/style="width:\s*65%/);
    expect(match).not.toBeNull();
  });

  it("renders the cover image with correct alt text", () => {
    const html = renderToString(<BooksWidget {...defaultProps} />);
    expect(html).toContain('alt="Books Widget"');
  });

  it("renders the container with books-widget class", () => {
    const html = renderToString(<BooksWidget {...defaultProps} />);
    expect(html).toContain("books-widget");
  });
});
