export default {
  install() {
    // @ts-ignore
    chrome.webstore.install();
  },
  setNotifiedImprovedScreenshots() {
    localStorage.setItem('HAS_NOTIFIED_IMPROVED_SCREENSHOTS', 'true');
  },
  hasNotifiedImprovedScreenshots() {
    return Boolean(localStorage.getItem('HAS_NOTIFIED_IMPROVED_SCREENSHOTS'));
  },
};
