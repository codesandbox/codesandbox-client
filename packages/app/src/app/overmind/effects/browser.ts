function getPopupOffset({ width, height }) {
  const wLeft = window.screenLeft ? window.screenLeft : window.screenX;
  const wTop = window.screenTop ? window.screenTop : window.screenY;

  const left = wLeft + window.innerWidth / 2 - width / 2;
  const top = wTop + window.innerHeight / 2 - height / 2;

  return { top, left };
}

function getPopupSize() {
  return { width: 1020, height: 618 };
}

function getPopupDimensions() {
  const { width, height } = getPopupSize();
  const { top, left } = getPopupOffset({ width, height });

  return `width=${width},height=${height},top=${top},left=${left}`;
}

export default {
  setTitle(title) {
    document.title = title;
  },
  alert(message) {
    return alert(message); // eslint-disable-line no-alert
  },
  confirm(message) {
    return confirm(message); // eslint-disable-line no-alert,no-restricted-globals
  },
  onUnload(cb) {
    window.onbeforeunload = cb;
  },
  openWindow(url) {
    window.open(url, '_blank');
  },
  openPopup(url, name) {
    const popup = window.open(
      url,
      name,
      `scrollbars=no,toolbar=no,location=no,titlebar=no,directories=no,status=no,menubar=no, ${getPopupDimensions()}`
    );
    return {
      close: () => popup.close(),
    };
  },
  waitForMessage<T>(type): Promise<T> {
    return new Promise(resolve => {
      window.addEventListener('message', function onMessage(event) {
        if (event.data.type === type) {
          window.removeEventListener('message', onMessage);
          resolve(event.data.data);
        }
      });
    });
  },
  reload() {
    location.reload(true);
  },
};
