import imageExtensions from 'image-extensions/image-extensions.json';
import * as path from './path';

const exts = new Set(imageExtensions);
export default filepath =>
  exts.has(
    path
      .extname(filepath)
      .slice(1)
      .toLowerCase()
  );
