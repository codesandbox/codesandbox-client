export const browser = () => {
  const agent = window.navigator.userAgent.toLowerCase();
  switch (true) {
    case agent.indexOf('edge') > -1:
      return 'edge';
    case agent.indexOf('edg') > -1:
      return 'chromium based edge (dev or canary)';
    // @ts-ignore
    case agent.indexOf('opr') > -1 && !!window.opr:
      return 'opera';
    // @ts-ignore
    case agent.indexOf('chrome') > -1 && !!window.chrome:
      return 'chrome';
    case agent.indexOf('trident') > -1:
      return 'ie';
    case agent.indexOf('firefox') > -1:
      return 'firefox';
    case agent.indexOf('brave') > -1:
      return 'brave';
    case agent.indexOf('safari') > -1:
      return 'safari';
    default:
      return 'other';
  }
};
