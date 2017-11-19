// @flow
const splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;

function splitPath(filename: string) {
  return splitPathRe.exec(filename).slice(1);
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  const res = [];
  for (let i = 0; i < parts.length; i += 1) {
    const p = parts[i];

    // ignore empty parts
    if (!p || p === '.') continue; // eslint-disable-line no-continue

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}

export function isAbsolute(path: string) {
  return path.charAt(0) === '/';
}

export function normalize(path: string) {
  const isAbs = isAbsolute(path);
  const trailingSlash = path && path[path.length - 1] === '/';
  let newPath = path;

  // Normalize the path
  newPath = normalizeArray(newPath.split('/'), !isAbs).join('/');

  if (!newPath && !isAbs) {
    newPath = '.';
  }
  if (newPath && trailingSlash) {
    newPath += '/';
  }

  return (isAbs ? '/' : '') + newPath;
}

export function join(...paths: Array<any>) {
  let path = '';
  for (let i = 0; i < paths.length; i += 1) {
    const segment = paths[i];

    if (typeof segment !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    if (segment) {
      if (!path) {
        path += segment;
      } else {
        path += `/${segment}`;
      }
    }
  }
  return normalize(path);
}

export function dirname(path: string) {
  const result = splitPath(path);
  const root = result[0];
  let dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

export function basename(p: string, ext: string = '') {
  // Special case: Normalize will modify this to '.'
  if (p === '') {
    return p;
  }
  // Normalize the string first to remove any weirdness.
  const path = normalize(p);
  // Get the last part of the string.
  const sections = path.split('/');
  const lastPart = sections[sections.length - 1];
  // Special case: If it's empty, then we have a string like so: foo/
  // Meaning, 'foo' is guaranteed to be a directory.
  if (lastPart === '' && sections.length > 1) {
    return sections[sections.length - 2];
  }
  // Remove the extension, if need be.
  if (ext.length > 0) {
    const lastPartExt = lastPart.substr(lastPart.length - ext.length);
    if (lastPartExt === ext) {
      return lastPart.substr(0, lastPart.length - ext.length);
    }
  }
  return lastPart;
}
