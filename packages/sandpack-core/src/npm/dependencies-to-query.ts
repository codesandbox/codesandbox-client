import { NPMDependencies } from '.';

const VERSION_RE = /(\d+)(\.\d+)?(\.\d+)?(-[^\s+]+)?/;

export function normalizeVersion(version: string): string {
  const matches = version.match(VERSION_RE);
  if (!matches?.length) {
    // Invalid semver or a string like `latest` which is also an invalid semver but someone introduced it for some reason...
    return version;
  }
  return matches[0];
}

export function dependencyToQuery(name: string, version: string) {
  return encodeURIComponent(`${name}@${normalizeVersion(version)}`);
}

export default function dependenciesToQuery(dependencies: NPMDependencies) {
  return Object.keys(dependencies)
    .sort()
    .map(name => dependencyToQuery(name, dependencies[name]))
    .join('+');
}
