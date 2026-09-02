# Client built against a books_collected GraphQL contract the server does not yet expose

The deployed schema (only `book_listings` and `book(id)`) cannot serve the Books Owned section: `books_collected` has no list query, and `book_listing_id`/`book_series_id` are not exposed, so the client cannot render owned cards or subtract owned books from "Books Not Owned". We decided to write the client against an agreed flat `books_collected` query shape (table columns plus listing fields joined server-side) rather than block on server work or probe `book(id)` by ID. The Books Owned section will error gracefully until the server implements the contract.

Uniqueness note: `UNIQUE(book_listing_id, book_series_id)` does not prevent duplicate standalone rows (SQLite treats NULLs as distinct); the server side of the contract is expected to enforce at most one Collected Book per listing (e.g. via a partial unique index on `book_listing_id WHERE book_series_id IS NULL`).
