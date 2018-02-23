import HTML5FS from '../../../src/backend/HTML5FS';
import {FileSystem} from '../../../src/core/file_system';

export default function HTML5FSFactory(cb: (name: string, obj: FileSystem[]) => void): void {
  if (HTML5FS.isAvailable()) {
    HTML5FS.Create({
      size: 10,
      type: window.TEMPORARY
    }, (e, fs?) => {
      if (e) {
        throw e;
      }
      fs.empty((e?) => {
        if (e) {
          throw e;
        }
        cb('HTML5FS', [fs]);
      });
    });
  } else {
    cb('HTML5FS', []);
  }
}
