import React from "react";

function useScrollPosition<T extends HTMLElement>() {
  const [hasScrolledToBottom, setHasScrolledToBottom] = React.useState(false);
  const termsBoxRef = React.useRef<T>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (termsBoxRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = termsBoxRef.current;
        // Check if scrolled to bottom (with 10px tolerance)
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setHasScrolledToBottom(true);
        }
      }
    };

    const termsBox = termsBoxRef.current;
    if (termsBox) {
      termsBox.addEventListener("scroll", handleScroll);
      return () => termsBox.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return { termsBoxRef, hasScrolledToBottom };
}

export default useScrollPosition;
