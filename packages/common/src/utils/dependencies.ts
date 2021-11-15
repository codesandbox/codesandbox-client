import { valid, maxSatisfying } from 'semver';

async function fetchWithRetries<T = any>(url: string): Promise<T> {
  let err: Error;
  for (let i = 0; i < 2; i++) {
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

interface JsDelivrApiResult {
  tags: {
    [semver: string]: string;
  };
  versions: string[];
}

async function fetchAllVersions(dep: string): Promise<JsDelivrApiResult> {
  return fetchWithRetries<JsDelivrApiResult>(
    `https://data.jsdelivr.com/v1/package/npm/${dep}`
  );
}

export async function getLatestVersion(
  dep: string,
  version: string
): Promise<string> {
  const fetchJsdelivr = () =>
    fetchWithRetries(
      `https://cdn.jsdelivr.net/npm/${dep}@${encodeURIComponent(
        version
      )}/package.json`
    ).then(x => x.version);
  const fetchUnpkg = () =>
    fetchWithRetries(
      `https://unpkg.com/${dep}@${encodeURIComponent(version)}/package.json`
    ).then(x => x.version);

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
      const allVersions = await fetchAllVersions(dep);
      return maxSatisfying(allVersions.versions, version);
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

  const version = await getLatestVersion(depName, depVersion);

  return { name: depName, version };
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
