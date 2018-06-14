import algoliasearch from 'algoliasearch';

import {
  CODE_SEARCH_ALGOLIA_API_KEY,
  CODE_SEARCH_ALGOLIA_APPLICATION_ID,
  CODE_SEARCH_ALGOLIA_DEFAULT_INDEX,
  CODE_SEARCH_SIZE_LIMIT,
} from 'common/utils/config';

const client = algoliasearch(
  CODE_SEARCH_ALGOLIA_APPLICATION_ID,
  CODE_SEARCH_ALGOLIA_API_KEY
);

const index = client.initIndex(CODE_SEARCH_ALGOLIA_DEFAULT_INDEX);

function sanitize(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// We store the path that we indexed to track the module that have been removed
let indexedPaths = {};

export function indexModules(modules, sandboxId) {
  const now = Date.now();

  const codeIndexBatch = Object.keys(modules).map(path => {
    const m = modules[path];

    m.objectID = path;
    m.sandboxId = sandboxId;
    m.code = sanitize(m.code);

    if (m.code.length > CODE_SEARCH_SIZE_LIMIT) {
      console.warn(path + ' is too big to be indexed');
      m.code = '';
    }

    indexedPaths[path] = now;

    return m;
  });

  // Push into index
  index.addObjects(codeIndexBatch, (err, res) => {
    if (err) {
      console.error('Code index encountered an error', err);
    }
  });

  // check for dead paths
  Object.keys(indexedPaths)
    .filter(k => indexedPaths[k] !== now)
    .forEach(k => {
      removeModule(k);
      delete indexedPaths[k];
    });
}

// Delete an indexed object
// Note that the ObjectId is the path
export function removeModule(path) {
  index.deleteObject(path, err => {
    if (err) {
      console.error(
        'Removing the path',
        path,
        'from the index encountered an error',
        err
      );
    }
  });
}
