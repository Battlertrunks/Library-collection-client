import { useRef, useState } from "react";
import { useMutation } from "@apollo/client/react";
import { ADD_BOOK_COLLECTED, REMOVE_BOOK_COLLECTED } from "./mutations";

// Both sections display the same collection from different angles, so either
// mutation refreshes the listings and the collected books together.
const REFETCH_QUERIES = ["GetBookListings", "GetBooksCollected"];

/**
 * Adds and removes Collected Books, keeping the Books Owned and Books Not
 * Owned sections in sync with the server.
 * @returns The add/remove actions, the listing id of an in-flight action, and
 * the latest error message.
 */
function useBookCollectionActions() {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runningRef = useRef(false);

  const [addBookCollected] = useMutation(ADD_BOOK_COLLECTED, {
    refetchQueries: REFETCH_QUERIES,
    awaitRefetchQueries: true,
  });
  const [removeBookCollected] = useMutation(REMOVE_BOOK_COLLECTED, {
    refetchQueries: REFETCH_QUERIES,
    awaitRefetchQueries: true,
  });

  async function run(bookListingId: string, mutate: () => Promise<unknown>) {
    // Ignore actions fired while another one is still running; the server
    // would reject the duplicate anyway.
    if (runningRef.current) {
      return;
    }
    runningRef.current = true;
    setPendingId(bookListingId);
    setError(null);

    try {
      await mutate();
    } catch (caught: unknown) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not update your collection. Please try again.",
      );
    }

    runningRef.current = false;
    setPendingId(null);
  }

  function addToOwned(bookListingId: string) {
    return run(bookListingId, () =>
      addBookCollected({ variables: { bookListingId } }),
    );
  }

  function removeFromOwned(bookListingId: string) {
    return run(bookListingId, () =>
      removeBookCollected({ variables: { bookListingId } }),
    );
  }

  return { addToOwned, removeFromOwned, pendingId, error };
}

export default useBookCollectionActions;
