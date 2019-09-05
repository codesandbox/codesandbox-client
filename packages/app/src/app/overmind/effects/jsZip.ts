import JSZip from 'jszip';

export default {
  loadAsync(file) {
    return JSZip.loadAsync(file);
  },
};
