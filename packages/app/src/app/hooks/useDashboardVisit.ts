import React from 'react';
import { useEffects } from 'app/overmind';

const KEY = 'DASHBOARD_VISIT';
type VisitTracker = number | undefined;
type ReturnType = {
  hasVisited: boolean;
  trackVisit: () => void;
};

export const useDashboardVisit = (): ReturnType => {
  const { browser } = useEffects();
  const [hasVisited, setHasVisited] = React.useState(() => {
    const visitCount = browser.storage.get<VisitTracker>(KEY) ?? 0;
    return visitCount > 1;
  });

  const trackVisit = () => {
    const visitCount = browser.storage.get<VisitTracker>(KEY) ?? 0;

    const updatedCount = visitCount + 1;
    browser.storage.set(KEY, updatedCount);
    setHasVisited(updatedCount > 1);
  };

  return { hasVisited, trackVisit };
};
