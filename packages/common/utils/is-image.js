import path from 'path';
import imageExtensions from 'image-extensions/image-extensions.json';

const exts = new Set(imageExtensions);
export default filepath =>
  exts.has(
    path
      .extname(filepath)
      .slice(1)
      .toLowerCase()
  );
