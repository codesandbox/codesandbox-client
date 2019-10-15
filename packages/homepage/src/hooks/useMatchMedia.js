import React from 'react';

export function useMatchMedia(query) {
  const mediaQueryList = window.matchMedia(query);
  const [match, setMatch] = React.useState(mediaQueryList.matches);

  React.useEffect(() => {
    const handleMatchChange = ev => setMatch(ev.matches);

    mediaQueryList.addListener(handleMatchChange);

    return () => {
      mediaQueryList.removeListener(handleMatchChange);
    };
  }, [mediaQueryList, query]);

  return match;
}
