import HTTPDownloadFSFactory from './httpdownloadfs_factory';
import {FileSystem} from '../../../src/core/file_system';
import ZipFS from '../../../src/backend/ZipFS';
import * as BrowserFS from '../../../src/core/browserfs';
import _fs from '../../../src/core/node_fs';

export default function ZipFSFactory(cb: (name: string, objs: FileSystem[]) => void): void {
  if (ZipFS.isAvailable()) {
    HTTPDownloadFSFactory((_, httpdownloadfs) => {
      if (httpdownloadfs.length === 0) {
        return cb('ZipFS', httpdownloadfs);
      }

      // Add three Zip FS variants for different zip files.
      var zipFiles = ['0', '4', '9'], i: number,
        rv: FileSystem[] = [], fs: typeof _fs = BrowserFS.BFSRequire('fs');
      // Leverage the HTTPFS to download the fixtures for this FS.
      BrowserFS.initialize(httpdownloadfs[0]);
      let countdown = zipFiles.length;
      function fetchZip(zipFilename: string): void {
        fs.readFile(zipFilename, (e, data?) => {
          if (e) throw e;
          ZipFS.Create({
            zipData: data,
            name: zipFilename
          }, (e, fs?) => {
            if (e) {
              throw e;
            }
            countdown--;
            rv.push(fs);
            if (countdown === 0) {
              cb('ZipFS', rv);
            }
          });
        });
      }
      for (i = 0; i < zipFiles.length; i++) {
        fetchZip(`/test/fixtures/zipfs/zipfs_fixtures_l${zipFiles[i]}.zip`);
      }
    });
  } else {
    cb('ZipFS', []);
  }
}
