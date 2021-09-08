import { valid } from 'semver';
import { fetchWithRetries } from './fetch';

export async function fetchPackageJSON(dep: string, version: string) {
  const fetchJsdelivr = () =>
    fetchWithRetries(
      `https://cdn.jsdelivr.net/npm/${dep}@${encodeURIComponent(
        version
      )}/package.json`
    );
  const fetchUnpkg = () =>
    fetchWithRetries(
      `https://unpkg.com/${dep}@${encodeURIComponent(version)}/package.json`
    );

  if (isAbsoluteVersion(version)) {
    try {
      return await fetchJsdelivr();
    } catch (e) {
      return fetchUnpkg();
    }
  } else {
    // If it is not an absolute version (e.g. a tag like `next`), we don't want to fetch
    // using JSDelivr, because JSDelivr caches the response for a long time. Because of this,
    // when a tag updates to a new version, people won't see that update for a long time.
    // Unpkg does handle this nicely, but is less stable. So we default to JSDelivr, but
    // for tags we use unpkg.
    try {
      return await fetchUnpkg();
    } catch (e) {
      return fetchJsdelivr();
    }
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
