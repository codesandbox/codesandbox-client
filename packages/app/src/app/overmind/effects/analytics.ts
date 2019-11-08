import track, {
  identify,
  setAnonymousId,
  setUserId,
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
    identify,
    setAnonymousId,
    setUserId,
  };
})();
