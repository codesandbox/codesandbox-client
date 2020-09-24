import { FetchProtocol, Meta } from '../../fetch-npm-module';
import { fetchWithRetries } from '../utils';
import { JSDelivrMeta, normalizeJSDelivr } from './utils';

/**
 * Converts urls like "https://github.com/user/repo.git" to "user/repo".
 */
const convertGitHubURLToVersion = (version: string) => {
  const result = version.match(/https:\/\/github\.com\/(.*)$/);
  if (result && result[1]) {
    const repo = result[1];
    return repo.replace(/\.git$/, '');
  }

  return version;
};

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
