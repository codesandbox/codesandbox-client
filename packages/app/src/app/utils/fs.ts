import * as fs from 'fs';

export function readFilePromise(
  path: string | number | Buffer | import('url').URL,
  options?: { encoding?: string; flag?: string }
): Promise<string | Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

export function readdirPromise(path: fs.PathLike): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(files);
    });
  });
}
