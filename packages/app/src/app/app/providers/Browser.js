import { Provider } from 'cerebral';

export default Provider({
  setTitle(title) {
    document.title = title;
  },
  confirm(message) {
    return confirm(message); // eslint-disable-line no-alert
  },
});
