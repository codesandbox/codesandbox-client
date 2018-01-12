import JSZip from 'jszip';
import { Provider } from 'cerebral';

export default Provider({
  loadAsync(file) {
    return JSZip.loadAsync(file);
  },
});
