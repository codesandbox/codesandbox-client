import React from 'react';

const isServerRender = typeof window === `undefined`;

export function useMatchMedia(query, defaultMatch = false) {
  const mediaQueryList = !isServerRender && window.matchMedia(query);
  const [match, setMatch] = React.useState(
    isServerRender ? defaultMatch : mediaQueryList.matches
  );

  React.useEffect(() => {
    const handleMatchChange = ev => setMatch(ev.matches);

    mediaQueryList.addListener(handleMatchChange);

    return () => {
      mediaQueryList.removeListener(handleMatchChange);
    };
  }, [mediaQueryList, query]);

  return match;
}
