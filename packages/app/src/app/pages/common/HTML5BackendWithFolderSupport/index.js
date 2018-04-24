import HTML5Backend from 'react-dnd-html5-backend';
import { getFilesFromDragEvent } from './html-dir-content';

export default (manager: Object) => {
  const backend = HTML5Backend(manager);
  const orgTopDropCapture = backend.handleTopDropCapture;

  backend.handleTopDropCapture = e => {
    orgTopDropCapture.call(backend, e);
    backend.currentNativeSource.item.dirContent = getFilesFromDragEvent(e, {
      recursive: true,
    }); // returns a promise
  };

  return backend;
};
