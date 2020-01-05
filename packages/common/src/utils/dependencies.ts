async function fetchWithRetries(url: string) {
  let err: Error;
  for (let i = 0; i < 5; i++) {
    try {
      // eslint-disable-next-line
      return await fetch(url).then(x => {
        if (x.ok) {
          return x.json();
        }

        throw new Error('Could not fetch ' + url);
      });
    } catch (e) {
      err = e;
    }
  }

  throw err;
}

export async function fetchPackageJSON(dep: string, version: string) {
  try {
    return fetchWithRetries(
      `https://cdn.jsdelivr.net/npm/${dep}@${encodeURIComponent(
        version
      )}/package.json`
    );
  } catch (e) {
    return fetchWithRetries(
      `https://unpkg.com/${dep}@${encodeURIComponent(version)}/package.json`
    );
  }
}

export function isAbsoluteVersion(version: string) {
  const isAbsolute = /^\d+\.\d+\.\d+$/.test(version);

  return isAbsolute || /\//.test(version);
}

export async function getAbsoluteDependencies(dependencies: Object) {
  const nonAbsoluteDependencies = Object.keys(dependencies).filter(
    dep => !isAbsoluteVersion(dependencies[dep])
  );

  const newDependencies = { ...dependencies };

  await Promise.all(
    nonAbsoluteDependencies.map(async dep => {
      try {
        const data = await fetchPackageJSON(dep, dependencies[dep]);

        newDependencies[dep] = data.version;
      } catch (e) {
        /* ignore */
      }
    })
  );

  return newDependencies;
}
