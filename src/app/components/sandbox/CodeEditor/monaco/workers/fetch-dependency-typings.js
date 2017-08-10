import path from 'path';
import ts from 'monaco-editor/min/vs/language/typescript/lib/typescriptServices';

const ROOT_URL = `https://unpkg.com/`;

const loadedTypings = [];

// Generate 1.2.3 to ^1.x.x
const getVersion = version => {
  const regex = /(\d*)\./;

  const match = version.match(regex);

  if (match) {
    return `^${match[1]}.x.x`;
  }

  return `^${version}`;
};

/**
 * Send the typings library to the editor, the editor can then add them to the
 * registry
 * @param {string} virtualPath Path of typings
 * @param {string} typings Typings
 */
const addLib = (virtualPath, typings, fetchedPaths) => {
  fetchedPaths.push(virtualPath);
  self.postMessage({
    path: virtualPath,
    typings,
  });
};

const fetchCache = {};

const doFetch = url => {
  if (fetchCache[url]) {
    return Promise.resolve(fetchCache[url]);
  }

  return fetch(url)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      const error = new Error(response.statusText || response.status);
      error.response = response;
      return Promise.reject(error);
    })
    .then(response => response.text())
    .then(response => {
      fetchCache[url] = response;
      return response;
    });
};

const fetchFromDefinitelyTyped = (dependency, version, fetchedPaths) =>
  doFetch(`${ROOT_URL}@types/${dependency}/index.d.ts`).then(typings => {
    addLib(
      `node_modules/@types/${dependency}/index.d.ts`,
      typings,
      fetchedPaths,
    );
  });

const getRequireStatements = (title: string, code: string) => {
  const requires = [];

  const sourceFile = ts.createSourceFile(
    title,
    code,
    ts.ScriptTarget.ES6,
    true,
  );

  ts.forEachChild(sourceFile, node => {
    switch (node.kind) {
      case ts.SyntaxKind.ImportDeclaration: {
        requires.push(node.moduleSpecifier.text);
        break;
      }
      default: {
        /* */
      }
    }
  });

  return requires;
};

const transformFiles = dir =>
  dir.files
    ? dir.files.reduce((prev, next) => {
        if (next.type === 'file') {
          return { ...prev, [next.path]: next };
        }

        return { ...prev, ...transformFiles(next) };
      }, {})
    : {};

const getFileMetaData = (depUrl, depPath) =>
  doFetch(`${depUrl}/${path.dirname(depPath)}?json`)
    .then(response => JSON.parse(response))
    .then(transformFiles);

const getFileTypes = (
  depUrl,
  dependency,
  depPath,
  fetchedPaths: Array<string>,
  fileMetaData,
) => {
  const virtualPath = `node_modules/${dependency}/${depPath}`;

  if (fetchedPaths.includes(virtualPath)) return null;

  return doFetch(`${depUrl}/${depPath}`).then(typings => {
    if (fetchedPaths.includes(virtualPath)) return null;

    addLib(virtualPath, typings, fetchedPaths);

    // Now find all require statements, so we can download those types too
    return getRequireStatements(depPath, typings)
      .filter(
        // Don't add global deps
        dep => dep.startsWith('.'),
      )
      .map(relativePath => path.join(path.dirname(depPath), relativePath))
      .map(relativePath => {
        const absolutePath = `/${relativePath}`;
        if (fileMetaData[absolutePath]) return relativePath;
        if (fileMetaData[`${absolutePath}.ts`]) return `${relativePath}.ts`;
        if (fileMetaData[`${absolutePath}.d.ts`]) return `${relativePath}.d.ts`;

        return relativePath;
      })
      .forEach(nextDepPath =>
        getFileTypes(
          depUrl,
          dependency,
          nextDepPath,
          fetchedPaths,
          fileMetaData,
        ),
      );
  });
};

function fetchAndAddDependencies(dependencies) {
  const fetchedPaths = [];
  Object.keys(dependencies).forEach(dep => {
    try {
      if (loadedTypings.indexOf(dep) === -1) {
        loadedTypings.push(dep);

        fetchFromDefinitelyTyped(
          dep,
          dependencies[dep],
          fetchedPaths,
        ).catch(() => {
          // Not available as @types, try checking in package.json

          const depUrl = `${ROOT_URL}${dep}@${getVersion(dependencies[dep])}`;
          doFetch(`${depUrl}/package.json`)
            .then(response => JSON.parse(response))
            .then(packageJSON => {
              if (packageJSON.typings) {
                // Add package.json, since this defines where all types lie
                addLib(
                  `node_modules/${dep}/package.json`,
                  JSON.stringify(packageJSON),
                  fetchedPaths,
                );

                // get all files in the specified directory
                getFileMetaData(depUrl, packageJSON.typings).then(fileData => {
                  getFileTypes(
                    depUrl,
                    dep,
                    packageJSON.typings,
                    fetchedPaths,
                    fileData,
                  );
                });
              }
            });
        });
      }
    } catch (e) {
      console.log(`Couldn't find typings for ${dep}`);
      console.error(e);
    }
  });
}

self.addEventListener('message', event => {
  const { dependencies } = event.data;

  fetchAndAddDependencies(dependencies);
});
