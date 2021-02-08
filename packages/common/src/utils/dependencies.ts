import { valid } from 'semver';

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

export function isValidSemver(version: string) {
  return Boolean(valid(version));
}

export async function getAbsoluteDependency(
  depName: string,
  depVersion: string
): Promise<{ name: string; version: string }> {
  if (isAbsoluteVersion(depVersion)) {
    return { name: depName, version: depVersion };
  }

  let data;
  if (depName === 'cerebral' && depVersion === 'latest') {
    // Bug in JSDelivr, this returns the wrong package.json (of a beta version). So use Unpkg
    data = await fetchWithRetries(
      `https://unpkg.com/cerebral@${encodeURIComponent('latest')}/package.json`
    );
  } else {
    data = await fetchPackageJSON(depName, depVersion);
  }

  return { name: depName, version: data.version };
}

export async function getAbsoluteDependencies(dependencies: {
  [dep: string]: string;
}) {
  const nonAbsoluteDependencies = Object.keys(dependencies).filter(
    dep => !isAbsoluteVersion(dependencies[dep])
  );

  const newDependencies = { ...dependencies };

  await Promise.all(
    nonAbsoluteDependencies.map(async dep => {
      try {
        const { version } = await getAbsoluteDependency(
          dep,
          newDependencies[dep]
        );

        newDependencies[dep] = version;
      } catch (e) {
        /* ignore */
      }
    })
  );

  return newDependencies;
}
