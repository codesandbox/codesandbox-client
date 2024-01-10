import path from 'path';
import { LoaderContext } from 'sandpack-core';
import parse from '../parser';

export default function (code: string, loaderContext: LoaderContext) {
  const query = loaderContext.options;
  const { context } = query;
  let filename = path.basename(loaderContext.path);
  filename =
    filename.substring(0, filename.lastIndexOf(path.extname(filename))) +
    '.vue';
  const sourceRoot = path.dirname(path.relative(context, loaderContext.path));
  const parts = parse(code, filename, false, sourceRoot, query.bustCache);
  let part = parts[query.type];
  if (Array.isArray(part)) {
    part = part[query.index];
  }

  return Promise.resolve({ transpiledCode: part ? part.content : '' });
}
