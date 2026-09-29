# Library Collection

Personal book library: a catalog of known books (listings) and a record of the books the owner actually possesses and has read.

## Language

**Book Listing**:
A catalog entry describing a published book (title, authors, cover, publication date). Exists whether or not the owner possesses it.
_Avoid_: Book (when meaning the catalog entry), product

**Collected Book**:
A single owned book in the collection, recorded against one Book Listing. Carries its own purchase date and completion state.
_Avoid_: Owned book, book copy

**Books Owned**:
The library page section listing Collected Books that are tied to a specific Book Listing. Series-level purchases do not appear here.

**Books Not Owned**:
Book Listings minus those referenced by a directly-tied Collected Book. Owning a series does NOT remove that series' member listings from this section.

**Series Purchase**:
A Collected Book recorded against a whole series rather than one listing. Out of scope for the Books Owned section; handled in the series context.

**Completed**:
Whether the owner has finished reading a particular Collected Book. A property of the Collected Book, never of the Book Listing — two copies of the same listing have independent completion states.
