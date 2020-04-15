import track, {
  identify,
  logError,
  setAnonymousId,
  setUserId,
  setGroup,
} from '@codesandbox/common/lib/utils/analytics';

export default (() => {
  const trackedEvents = {};

  return {
    track,
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
