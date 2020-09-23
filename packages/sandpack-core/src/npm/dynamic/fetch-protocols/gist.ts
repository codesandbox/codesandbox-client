import { FetchProtocol, Meta } from '../fetch-npm-module';
import { fetchWithRetries } from './utils';

type GistAPIResponse = {
  path: string;
  type: 'file' | 'directory';
  files: {
    [fileName: string]: {
      filename: string;
      type: string;
      language: string;
      raw_url: string;
      size: number;
      truncated: boolean;
      content: string;
    };
  };
};

function normalize(files: GistAPIResponse['files']) {
  const normalizedResponse: { [path: string]: true } = {};
  const fileNames = Object.keys(files);

  for (let i = 0; i < fileNames.length; i += 1) {
    const fileName = fileNames[i];
    const absolutePath = '/' + fileName;
    normalizedResponse[absolutePath] = true; // eslint-disable-line no-param-reassign
  }

  return normalizedResponse;
}

export class GistFetcher implements FetchProtocol {
  private fetchedGists: { [ver: string]: GistAPIResponse } = {};

  getAPIURl(version: string) {
    const gistId = version.replace(/.*\//, '');
    return 'https://api.github.com/gists/' + gistId;
  }

  private async fetchGist(version: string) {
    if (this.fetchedGists[version]) {
      return this.fetchedGists[version];
    }

    const url = this.getAPIURl(version);
    const result: GistAPIResponse = await fetchWithRetries(url).then(x =>
      x.json()
    );
    this.fetchedGists[version] = result;

    return result;
  }

  async file(name: string, version: string, path: string): Promise<string> {
    const result = await this.fetchGist(version);
    const file = result.files[path.replace(/^\//, '')];
    if (!file) {
      throw new Error('File not found: ' + path);
    }
    if (file.truncated) {
      return fetchWithRetries(file.raw_url).then(t => t.text());
    }

    return file.content;
  }

  async meta(name: string, version: string): Promise<Meta> {
    const result = await this.fetchGist(version);

    return normalize(result.files!);
  }
}
