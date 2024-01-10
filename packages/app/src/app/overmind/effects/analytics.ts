import track, {
  identify,
  logError,
  setAnonymousId,
  setUserId,
  setGroup,
} from '@codesandbox/common/lib/utils/analytics';

export default (() => {
  const trackedEvents = {};
  const trackedEventsByTime: Record<string, number> = {};

  return {
    track,
    /**
     * Tracks an event once every "cooldown". So we only send an event x amount of time.
     * This is useful for "spammy" events.
     * @param event event name
     * @param cooldown time to wait in ms
     * @param data any extra data
     */
    trackWithCooldown(event: string, cooldown: number, data: any = {}) {
      const now = Date.now();
      if (trackedEventsByTime[event]) {
        if (now - trackedEventsByTime[event] <= cooldown) {
          return;
        }
      }

      trackedEventsByTime[event] = now;
      track(event, data);
    },
    trackOnce(event: string, data: any = {}) {
      if (trackedEvents[event]) {
        return;
      }
      trackedEvents[event] = true;
      track(event, data);
    },
    logError,
    identify,
    setAnonymousId,
    setUserId,
    setGroup,
  };
})();
