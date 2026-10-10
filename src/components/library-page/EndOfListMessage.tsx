import { useEffect, useRef, useState } from "react";
import { revealOpacity } from "./revealOpacity";

/**
 * Bottom-of-page message that fades in as the user scrolls it into view,
 * signalling that every book has been loaded.
 */
function EndOfListMessage() {
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let frameId = 0;

    function update() {
      frameId = 0;
      const message = messageRef.current;
      if (!message) {
        return;
      }
      setOpacity(
        revealOpacity(message.getBoundingClientRect().top, window.innerHeight),
      );
    }

    function handleScroll() {
      if (frameId) {
        return;
      }
      frameId = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <p
      ref={messageRef}
      className="end-of-list py-8 text-center text-gray-500 dark:text-gray-400"
      style={{ opacity }}
      aria-live="polite"
    >
      You have reached the end 🥳
    </p>
  );
}

export default EndOfListMessage;
