import React from 'react';

// https://joshwcomeau.com/react/prefers-reduced-motion/
const QUERY = '(prefers-reduced-motion: reduce)';
const isRenderingOnServer = typeof window === 'undefined';
const getInitialState = () =>
  isRenderingOnServer ? true : window.matchMedia(QUERY).matches;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(
    getInitialState
  );
  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = event => {
      setPrefersReducedMotion(!event.matches);
    };
    mediaQueryList.addListener(listener);
    return () => {
      mediaQueryList.removeListener(listener);
    };
  }, []);
  return prefersReducedMotion;
}

export default usePrefersReducedMotion;
