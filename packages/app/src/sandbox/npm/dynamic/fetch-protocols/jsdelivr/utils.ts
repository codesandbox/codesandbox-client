import { Meta } from '../../fetch-npm-module';

export type JSDelivrMeta = {
  default: string;
  files: Array<{
    name: string;
    hash: string;
    time: string;
    size: number;
  }>;
};

export function normalizeJSDelivr(
  files: JSDelivrMeta['files'],
  fileObject: Meta = {}
) {
  for (let i = 0; i < files.length; i += 1) {
    fileObject[files[i].name] = true; // eslint-disable-line no-param-reassign
  }

  return fileObject;
}
