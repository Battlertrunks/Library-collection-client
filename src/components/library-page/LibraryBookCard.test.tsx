import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import LibraryBookCard from "./LibraryBookCard";
import type { BookListing } from "../../types/bookListing";

const book: BookListing = {
  id: "1",
  title: "Dropsite Massacre",
  authors: "Graham McNeill",
  thumbnailUrl: "",
  publishedDate: "2024-01-01T12:00:00",
};

describe("LibraryBookCard", () => {
  it("renders title and authors", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("Dropsite Massacre");
    expect(html).toContain("Graham McNeill");
  });

  it("renders the published date when not owned", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("Jan 1, 2024");
    expect(html).not.toContain("Purchased");
  });

  it("does not render the completed badge by default", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).not.toContain("Completed");
  });

  it("renders the purchase date and completed badge when owned", () => {
    const html = renderToString(
      <LibraryBookCard
        book={book}
        owned={{ datePurchased: "2025-06-15T12:00:00", completed: true }}
      />,
    );
    expect(html).toContain("Purchased Jun 15, 2025");
    expect(html).toContain("Completed");
  });

  it("omits the completed badge when owned but not completed", () => {
    const html = renderToString(
      <LibraryBookCard
        book={book}
        owned={{ datePurchased: "2025-06-15T12:00:00", completed: false }}
      />,
    );
    expect(html).toContain("Purchased");
    expect(html).not.toContain("Completed");
  });

  it("uses the default cover when thumbnail is missing", () => {
    const html = renderToString(<LibraryBookCard book={book} />);
    expect(html).toContain("No+Cover");
  });
});
