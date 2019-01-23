import {FileSystem} from '../../../src/core/file_system';
import HTTPRequest from '../../../src/backend/HTTPRequest';

export default function HTTPDownloadFSFactory(cb: (name: string, objs: FileSystem[]) => void): void {
  if (HTTPRequest.isAvailable()) {
    HTTPRequest.Create({
      index: 'test/fixtures/httpdownloadfs/listings.json',
      baseUrl: '../',
      preferXHR: true
    }, (e1, xhrFS) => {
      HTTPRequest.Create({
        index: 'test/fixtures/httpdownloadfs/listings.json',
        baseUrl: '../',
        preferXHR: false
      }, (e2, fetchFS) => {
        if (e1 || e2) {
          throw e1 || e2;
        } else {
          cb('HTTPRequest', [xhrFS, fetchFS]);
        }
      });
    });
  } else {
    cb('HTTPRequest', []);
  }
}
