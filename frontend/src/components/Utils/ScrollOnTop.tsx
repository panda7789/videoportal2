import { useEffect } from "react";

// eslint-disable-next-line import/prefer-default-export
export function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}