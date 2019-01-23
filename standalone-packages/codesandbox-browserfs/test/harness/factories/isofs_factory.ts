import HTTPDownloadFSFactory from './httpdownloadfs_factory';
import {FileSystem} from '../../../src/core/file_system';
import IsoFS from '../../../src/backend/IsoFS';
import * as BrowserFS from '../../../src/core/browserfs';

const isodir = "/test/fixtures/isofs";
export default function IsoFSFactory(cb: (name: string, objs: FileSystem[]) => void): void {
  if (IsoFS.isAvailable()) {
    HTTPDownloadFSFactory((_, httpdownloadfs) => {
      if (httpdownloadfs.length === 0) {
        return cb('IsoFS', httpdownloadfs);
      }

      // Leverage the HTTPFS to download the fixtures for this FS.
      BrowserFS.initialize(httpdownloadfs[0]);
      let fs = BrowserFS.BFSRequire('fs');

      // Add three Zip FS variants for different zip files.
      let isoFiles = fs.readdirSync(isodir);
      let rv: FileSystem[] = [];
      let countdown = isoFiles.length;
      function fetchIso(isoFilename: string): void {
        fs.readFile(isoFilename, (e, data?) => {
          if (e) throw e;
          IsoFS.Create({
            data: data,
            name: isoFilename
          }, (e, fs?) => {
            if (e) {
              throw e;
            }
            rv.push(fs);
            countdown--;
            if (countdown === 0) {
              cb('IsoFS', rv);
            }
          });
        });
      }
      for (let i = 0; i < isoFiles.length; i++) {
        fetchIso(`${isodir}/${isoFiles[i]}`);
      }
    });
  } else {
    cb('IsoFS', []);
  }
}
