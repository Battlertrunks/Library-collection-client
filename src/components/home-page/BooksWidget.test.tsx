import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import BooksWidget from "./BooksWidget";
import type { BookListing } from "../../types/bookListing";
import { DEFAULT_BOOK_COVER } from "../../utils/bookFormat";

const book: BookListing = {
  id: "1",
  title: "The Great Gatsby",
  authors: "F. Scott Fitzgerald",
  thumbnailUrl: "https://covers.example/gatsby.jpg",
  publishedDate: "1925-04-10",
  description: "",
  genres: "",
  createdAt: "2026-01-01",
};

describe("BooksWidget", () => {
  it("renders the title", () => {
    const html = renderToString(<BooksWidget book={book} progress={65} />);
    expect(html).toContain("The Great Gatsby");
  });

  it("renders the author", () => {
    const html = renderToString(<BooksWidget book={book} progress={65} />);
    expect(html).toContain("F. Scott Fitzgerald");
  });

  it("renders the completion percentage text", () => {
    const html = renderToString(<BooksWidget book={book} progress={65} />);
    expect(html).toContain("65% Complete");
  });

  it("renders the progress bar with correct width", () => {
    const html = renderToString(<BooksWidget book={book} progress={65} />);
    const match = html.match(/style="width:\s*65%/);
    expect(match).not.toBeNull();
  });

  it("renders the listing cover with descriptive alt text", () => {
    const html = renderToString(<BooksWidget book={book} progress={65} />);
    expect(html).toContain("https://covers.example/gatsby.jpg");
    expect(html).toContain('alt="The Great Gatsby cover"');
  });

  it("falls back to the default cover without a thumbnail", () => {
    const html = renderToString(
      <BooksWidget book={{ ...book, thumbnailUrl: "" }} progress={65} />,
    );
    expect(html).toContain(DEFAULT_BOOK_COVER);
  });

  it("renders the container with books-widget class", () => {
    const html = renderToString(<BooksWidget book={book} progress={65} />);
    expect(html).toContain("books-widget");
  });
});
