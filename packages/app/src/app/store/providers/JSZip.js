import JSZip from 'jszip';
import { Provider } from '@cerebral/fluent';

export default Provider({
  loadAsync(file) {
    return JSZip.loadAsync(file);
  },
});
