export const DNT = !!(
  window.doNotTrack ||
  window.navigator.doNotTrack ||
  window.navigator.msDoNotTrack
);

export default function track(eventName, secondArg: any) {
  if (window.ga && !DNT) {
    window.ga('send', secondArg);

    if (typeof window.amplitude !== 'undefined') {
      window.amplitude.logEvent(eventName, secondArg);
    }
  }
}
