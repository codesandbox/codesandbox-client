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
    // Split the repo and requested version
    const [repo, repoVersion] = convertGitHubURLToVersion(version).split('@');

    // Fetch repo meta from GitHub
    // If the version is not specified, we use the default_branch from the repo meta
    let metaBranch = repoVersion;
    if (!metaBranch) {
      metaBranch = await fetch(`https://api.github.com/repos/${repo}`)
        .then(x => x.json())
        .then(x => x.default_branch);
    }

    // We get the sha of the requested version
    const sha = await fetch(
      `https://api.github.com/repos/${repo}/commits/${metaBranch}`
    )
      .then(x => x.json())
      .then(x => x.sha);

    const url = `https://data.jsdelivr.com/v1/package/gh/${repo}@${sha}/flat`;

    const result: JSDelivrMeta = await fetchWithRetries(url).then(x =>
      x.json()
    );

    return normalizeJSDelivr(result.files, {});
  }
}
