import DropboxFileSystem from '../../../src/backend/Dropbox';
import {FileSystem} from '../../../src/core/file_system';
import {Dropbox} from 'dropbox_bridge';
import {ApiError} from '../../../src/core/api_error';

export default function DBFSFactory(cb: (name: string, obj: FileSystem[]) => void): void {
  function login(creds: DropboxTypes.DropboxOptions) {
    const client = new Dropbox(creds);
    client.usersGetCurrentAccount(undefined).then((res) => {
      return new Promise<DropboxFileSystem>((resolve, reject) => {
        console.debug(`Successfully connected to ${res.name.display_name}'s Dropbox.`);
        DropboxFileSystem.Create({ client }, (e, fs?) => {
          if (fs) {
            fs.empty((e) => {
              if (e) {
                reject(e);
              } else {
                resolve(fs);
              }
            });
          } else {
            reject(e);
          }
        });
      });
    }).then((fs) => {
      cb("Dropbox", [fs]);
    }).catch((e: DropboxTypes.Error<any> | ApiError) => {
      if (e instanceof ApiError) {
        throw e;
      } else {
        throw new Error(`Failed to log in to Dropbox: ${e.user_message.text}`);
      }
    });
  }
  if (DropboxFileSystem.isAvailable()) {
    // Authenticate with pregenerated unit testing credentials.
    const req = new XMLHttpRequest();
    req.open('GET', '/test/fixtures/dropbox/token.json');
    req.onerror = (e) => { console.error(req.statusText); throw new Error(`Unable to fetch Dropbox tokens: ${req.statusText}`); };
    req.onload = (e) => {
      if (!(req.readyState === 4 && req.status === 200)) {
        console.error(req.statusText);
        throw new Error(`Unable to fetch Dropbox tokens: ${req.statusText}`);
      }
      login(JSON.parse(req.response));
    };
    req.send();
  } else {
    cb('Dropbox', []);
  }
}
