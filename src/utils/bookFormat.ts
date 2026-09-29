export const DEFAULT_BOOK_COVER =
  "https://placehold.co/128x192/gray/white?text=No+Cover";

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export type TruncatedText = {
  text: string;
  truncated: boolean;
};

export function truncateWords(text: string, wordLimit: number): TruncatedText {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= wordLimit) {
    return { text, truncated: false };
  }
  return { text: `${words.slice(0, wordLimit).join(" ")}…`, truncated: true };
}
