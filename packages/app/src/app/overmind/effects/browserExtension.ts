export default {
  install() {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      chrome.webstore.install(
        'https://chrome.google.com/webstore/detail/aandnjmckilnalnkmbmodifapcedaofn',
        resolve,
        reject
      );
    });
  },
  setNotifiedImprovedScreenshots() {
    localStorage.setItem('HAS_NOTIFIED_IMPROVED_SCREENSHOTS', 'true');
  },
  hasNotifiedImprovedScreenshots() {
    return Boolean(localStorage.getItem('HAS_NOTIFIED_IMPROVED_SCREENSHOTS'));
  },
};
