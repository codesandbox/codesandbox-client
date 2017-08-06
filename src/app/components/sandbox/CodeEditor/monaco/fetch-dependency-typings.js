const ROOT_URL = `https://unpkg.com/@types/`;

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

export default async function fetchAndAddDependencies(dependencies, monaco) {
  Object.keys(dependencies).forEach(dep => {
    try {
      if (loadedTypings.indexOf(dep) === -1) {
        fetch(`${ROOT_URL}${dep}@${getVersion(dependencies[dep])}/index.d.ts`)
          .then(response => response.text())
          .then(typings => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              typings,
              `node_modules/@types/${dep}/index.d.ts`,
            );
            loadedTypings.push(dep);
            console.log(`Added ${dep}.d.ts`);
          });
      }
    } catch (e) {
      console.log(`Couldn't find typings for ${dep}`);
      console.error(e);
    }
  });
}
