export const browser = () => {
  const agent = window.navigator.userAgent.toLowerCase();
  switch (true) {
    case agent.includes('edge'):
      return 'edge';
    case agent.includes('edg'):
      return 'chromium based edge (dev or canary)';
    // @ts-ignore
    case agent.includes('opr') && !!window.opr:
      return 'opera';
    // @ts-ignore
    case agent.includes('chrome') && !!window.chrome:
      return 'chrome';
    case agent.includes('trident'):
      return 'ie';
    case agent.includes('firefox'):
      return 'firefox';
    case agent.includes('brave'):
      return 'brave';
    case agent.includes('safari'):
      return 'safari';
    default:
      return 'other';
  }
};
