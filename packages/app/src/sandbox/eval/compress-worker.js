import { compressToBase64 as LZCompress } from 'lz-string';

/**
 * Just compress the data using lz-string
 */
export function compress(data) {
  return LZCompress(data);
}
