import { FetchProtocol, Meta } from '../../fetch-npm-module';
import { fetchWithRetries } from '../utils';
import { JSDelivrMeta, normalizeJSDelivr } from './utils';

/**
 * Converts urls like "https://github.com/user/repo.git" to "user/repo".
 */
const GH_RE = /^(((https:\/\/)|(git(\+(ssh|https))?:\/\/(.*@)?))(www\.)?github\.com(\/|:))?(([^\s#/]*)\/([^\s#/]*))(#(.*))?$/;
export function convertGitHubURLToVersion(ghUrl: string) {
  const result = ghUrl.match(GH_RE);
  if (result && result[10]) {
    const repo = result[10];
    const version = result[14];
    const cleanedRepo = repo.replace(/\.git$/, '');
    if (version) {
      return `${cleanedRepo}@${version}`;
    }
    return cleanedRepo;
  }
  return ghUrl;
}

export function isGithubDependency(ghUrl: string) {
  return GH_RE.test(ghUrl);
}

export class JSDelivrGHFetcher implements FetchProtocol {
  async file(name: string, version: string, path: string): Promise<string> {
    const url = `https://cdn.jsdelivr.net/gh/${convertGitHubURLToVersion(
      version
    )}${path}`;
    const result = await fetchWithRetries(url).then(x => x.text());

    return result;
  }

  async meta(name: string, version: string): Promise<Meta> {
    // First get latest sha from GitHub API
    const sha = await fetch(
      `https://api.github.com/repos/${convertGitHubURLToVersion(
        version
      )}/commits/master`
    )
      .then(x => x.json())
      .then(x => x.sha);

    const url = `https://data.jsdelivr.com/v1/package/gh/${convertGitHubURLToVersion(
      version
    )}@${sha}/flat`;

    const result: JSDelivrMeta = await fetchWithRetries(url).then(x =>
      x.json()
    );

    return normalizeJSDelivr(result.files, {});
  }
}
