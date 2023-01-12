import React from 'react';
import { useEffects } from 'app/overmind';

const KEY = 'DASHBOARD_VISIT';
type VisitTracker = number | undefined;

export const useDashboardVisit = (
  currentTeam: string
): [boolean, () => void] => {
  const { browser } = useEffects();
  const [hasVisited, setHasVisited] = React.useState(() => {
    const visitCount = browser.storage.get<VisitTracker>(KEY);
    return visitCount > 1;
  });

  const trackVisit = () => {
    const visitCount = browser.storage.get<VisitTracker>(KEY) || undefined;

    const updatedCount = (visitCount || 0) + 1;
    browser.storage.set(KEY, updatedCount);
    setHasVisited(updatedCount > 1);
  };

  return [hasVisited, trackVisit];
};
