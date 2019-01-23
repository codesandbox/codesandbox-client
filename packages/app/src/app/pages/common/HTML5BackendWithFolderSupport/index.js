import HTML5Backend from 'react-dnd-html5-backend';
import { getFilesFromDragEvent } from './html-dir-content';

export default (manager: Object) => {
  const backend = HTML5Backend(manager);
  const orgTopDropCapture = backend.handleTopDropCapture;

  backend.handleTopDropCapture = e => {
    orgTopDropCapture.call(backend, e);

    const item = backend.monitor.getItem();
    if (item && item.path) {
      // Big hack we do to make VSCode operate happily with the dropped file.
      // We monkey patch the getData function to return the right URI, normally
      // we have to do this on the drag event with setData instead of the drop event, but we
      // don't have access to it so we monkey-patch.
      e.dataTransfer.getData = type => {
        if (type !== 'ResourceURLs') {
          return '';
        }
        return JSON.stringify([`file:///sandbox${item.path}`]);
      };
    }
    if (backend.currentNativeSource) {
      backend.currentNativeSource.item.dirContent = getFilesFromDragEvent(e, {
        recursive: true,
      }); // returns a promise
    }
  };

  return backend;
};
