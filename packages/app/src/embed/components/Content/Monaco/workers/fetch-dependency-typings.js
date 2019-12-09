/* eslint-disable no-param-reassign */
import path from 'path';

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/2.7.2/typescript.min.js',
]);

const ROOT_URL = `https://cdn.jsdelivr.net/`;

const loadedTypings = [];

/**
 * Send the typings library to the editor, the editor can then add them to the
 * registry
 * @param {string} virtualPath Path of typings
 * @param {string} typings Typings
 */
const addLib = (virtualPath, typings, fetchedPaths) => {
  fetchedPaths[virtualPath] = typings;
};

const fetchCache = new Map();

const doFetch = url => {
  const cached = fetchCache.get(url);
  if (cached) {
    return cached;
  }

  const promise = fetch(url)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      const error = new Error(response.statusText || response.status);
      error.response = response;
      return Promise.reject(error);
    })
    .then(response => response.text());

  fetchCache.set(url, promise);
  return promise;
};

const fetchFromDefinitelyTyped = (dependency, version, fetchedPaths) =>
  doFetch(
    `${ROOT_URL}npm/@types/${dependency
      .replace('@', '')
      .replace(/\//g, '__')}/index.d.ts`
  ).then(typings => {
    addLib(
      `node_modules/@types/${dependency}/index.d.ts`,
      typings,
      fetchedPaths
    );
  });

const getRequireStatements = (title: string, code: string) => {
  const requires = [];

  const sourceFile = self.ts.createSourceFile(
    title,
    code,
    self.ts.ScriptTarget.Latest,
    true,
    self.ts.ScriptKind.TS
  );

  self.ts.forEachChild(sourceFile, node => {
    switch (node.kind) {
      case self.ts.SyntaxKind.ImportDeclaration: {
        requires.push(node.moduleSpecifier.text);
        break;
      }
      case self.ts.SyntaxKind.ExportDeclaration: {
        // For syntax 'export ... from '...'''
        if (node.moduleSpecifier) {
          requires.push(node.moduleSpecifier.text);
        }
        break;
      }
      default: {
        /* */
      }
    }
  });

  return requires;
};

const tempTransformFiles = files => {
  const finalObj = {};

  files.forEach(d => {
    finalObj[d.name] = d;
  });

  return finalObj;
};

const getFileMetaData = (dependency, version, depPath) =>
  doFetch(
    `https://data.jsdelivr.com/v1/package/npm/${dependency}@${version}/flat`
  )
    .then(response => JSON.parse(response))
    .then(response => response.files.filter(f => f.name.startsWith(depPath)))
    .then(tempTransformFiles);

const resolveAppropiateFile = (fileMetaData, relativePath) => {
  const absolutePath = `/${relativePath}`;

  if (fileMetaData[`${absolutePath}.d.ts`]) return `${relativePath}.d.ts`;
  if (fileMetaData[`${absolutePath}.ts`]) return `${relativePath}.ts`;
  if (fileMetaData[absolutePath]) return relativePath;
  if (fileMetaData[`${absolutePath}/index.d.ts`])
    return `${relativePath}/index.d.ts`;

  return relativePath;
};

const getFileTypes = (
  depUrl,
  dependency,
  depPath,
  fetchedPaths: Array<string>,
  fileMetaData
) => {
  const virtualPath = path.join('node_modules', dependency, depPath);

  if (fetchedPaths[virtualPath]) return null;

  return doFetch(`${depUrl}/${depPath}`).then(typings => {
    if (fetchedPaths[virtualPath]) return null;

    addLib(virtualPath, typings, fetchedPaths);

    // Now find all require statements, so we can download those types too
    return Promise.all(
      getRequireStatements(depPath, typings)
        .filter(
          // Don't add global deps
          dep => dep.startsWith('.')
        )
        .map(relativePath => path.join(path.dirname(depPath), relativePath))
        .map(relativePath => resolveAppropiateFile(fileMetaData, relativePath))
        .map(nextDepPath =>
          getFileTypes(
            depUrl,
            dependency,
            nextDepPath,
            fetchedPaths,
            fileMetaData
          )
        )
    );
  });
};

function fetchFromMeta(dependency, version, fetchedPaths) {
  const depUrl = `https://data.jsdelivr.com/v1/package/npm/${dependency}@${version}/flat`;
  return doFetch(depUrl)
    .then(response => JSON.parse(response))
    .then(meta => {
      const filterAndFlatten = (files, filter) =>
        files.reduce((paths, file) => {
          if (filter.test(file.name)) {
            paths.push(file.name);
          }
          return paths;
        }, []);

      let dtsFiles = filterAndFlatten(meta.files, /\.d\.ts$/);
      if (dtsFiles.length === 0) {
        // if no .d.ts files found, fallback to .ts files
        dtsFiles = filterAndFlatten(meta.files, /\.ts$/);
      }

      if (dtsFiles.length === 0) {
        throw new Error('No inline typings found.');
      }

      return Promise.all(
        dtsFiles.map(file =>
          doFetch(
            `https://cdn.jsdelivr.net/npm/${dependency}@${version}${file}`
          )
            .then(dtsFile =>
              addLib(`node_modules/${dependency}${file}`, dtsFile, fetchedPaths)
            )
            .catch(() => {})
        )
      );
    });
}

function fetchFromTypings(dependency, version, fetchedPaths) {
  const depUrl = `${ROOT_URL}npm/${dependency}@${version}`;
  return doFetch(`${depUrl}/package.json`)
    .then(response => JSON.parse(response))
    .then(packageJSON => {
      const types = packageJSON.typings || packageJSON.types;
      if (types) {
        // Add package.json, since this defines where all types lie
        addLib(
          `node_modules/${dependency}/package.json`,
          JSON.stringify(packageJSON),
          fetchedPaths
        );

        // get all files in the specified directory
        return getFileMetaData(
          dependency,
          version,
          path.join('/', path.dirname(types))
        ).then(fileData =>
          getFileTypes(
            depUrl,
            dependency,
            resolveAppropiateFile(fileData, types),
            fetchedPaths,
            fileData
          )
        );
      }

      throw new Error('No typings field in package.json');
    });
}

async function fetchAndAddDependencies(dependencies) {
  const fetchedPaths = {};

  const depNames = Object.keys(dependencies);

  await Promise.all(
    depNames.map(async dep => {
      try {
        if (!loadedTypings.includes(dep)) {
          loadedTypings.push(dep);

          const depVersion = await doFetch(
            `https://data.jsdelivr.com/v1/package/resolve/npm/${dep}@${dependencies[dep]}`
          )
            .then(x => JSON.parse(x))
            .then(x => x.version);
          // eslint-disable-next-line no-await-in-loop
          await fetchFromTypings(dep, depVersion, fetchedPaths).catch(() =>
            // not available in package.json, try checking meta for inline .d.ts files
            fetchFromMeta(dep, depVersion, fetchedPaths).catch(() =>
              // Not available in package.json or inline from meta, try checking in @types/
              fetchFromDefinitelyTyped(dep, depVersion, fetchedPaths)
            )
          );
        }
      } catch (e) {
        // Don't show these cryptic messages to users, because this is not vital
        if (process.env.NODE_ENV === 'development') {
          console.error(`Couldn't find typings for ${dep}`, e);
        }
      }
    })
  );

  self.postMessage(fetchedPaths);
}

self.addEventListener('message', event => {
  const { dependencies } = event.data;

  fetchAndAddDependencies(dependencies);
});
