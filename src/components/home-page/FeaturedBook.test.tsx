import { describe, it, expect, vi } from "vitest";
import { renderToString } from "react-dom/server";
import FeaturedBook from "./FeaturedBook";
import type { BookListing } from "../../types/bookListing";

const book: BookListing = {
  id: "1",
  title: "The Horus Heresy: Know No Fear",
  authors: "Dan Abnett",
  thumbnailUrl: "https://covers.example/know-no-fear.jpg",
  publishedDate: "2019-02-26",
  description: "",
  genres: "",
  createdAt: "2026-01-01",
};

describe("FeaturedBook", () => {
  it("renders the 'Book of the Day' heading", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain("Book of the Day");
  });

  it("renders the book title", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain("The Horus Heresy: Know No Fear");
  });

  it("renders the author with 'by' prefix", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain("Dan Abnett");
    expect(html).toContain("by");
  });

  it("renders the publish year", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain("2019");
  });

  it("omits the publish year when the date is unknown", () => {
    const html = renderToString(
      <FeaturedBook
        book={{ ...book, publishedDate: "" }}
        loading={false}
        error={null}
      />,
    );
    expect(html).not.toContain("2019");
  });

  it("renders the cover image with correct alt text", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain("https://covers.example/know-no-fear.jpg");
    expect(html).toContain('alt="The Horus Heresy: Know No Fear cover"');
  });

  it("renders the cover image with the featured-book__cover class", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain("featured-book__cover");
  });

  it("renders the outer container with mt-10 class", () => {
    const html = renderToString(
      <FeaturedBook book={book} loading={false} error={null} />,
    );
    expect(html).toContain('class="mt-10"');
  });

  it("renders the card as a Book Details dialog trigger", () => {
    const html = renderToString(
      <FeaturedBook
        book={book}
        loading={false}
        error={null}
        onOpen={vi.fn()}
      />,
    );
    expect(html).toContain("featured-book__card");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain(
      'aria-label="Open details for The Horus Heresy: Know No Fear"',
    );
  });

  it("shows a loading message while the pick is fetched", () => {
    const html = renderToString(
      <FeaturedBook book={null} loading={true} error={null} />,
    );
    expect(html).toContain("Picking a book for today...");
  });

  it("shows an empty message when nothing is in progress", () => {
    const html = renderToString(
      <FeaturedBook book={null} loading={false} error={null} />,
    );
    expect(html).toContain(
      "Collect a book and start reading to see it featured here.",
    );
    expect(html).not.toContain("featured-book__cover");
  });

  it("shows the error message when the pick fails", () => {
    const html = renderToString(
      <FeaturedBook
        book={null}
        loading={false}
        error={new Error("Could not load the book of the day")}
      />,
    );
    expect(html).toContain("Could not load the book of the day");
  });
});
