// utility for generating a uid for each component file
// used in scoped CSS rewriting
import path from 'path';
import hash from 'hash-sum';

const cache = Object.create(null);
const sepRE = new RegExp(path.sep.replace('\\', '\\\\'), 'g');

export default function genId(file, context, key) {
  const contextPath = context.split(path.sep);
  const rootId = contextPath[contextPath.length - 1];

  /* eslint-disable */
  file =
    rootId +
    '/' +
    path.relative(context, file).replace(sepRE, '/') +
    (key || '');
  return cache[file] || (cache[file] = hash(file));
}
