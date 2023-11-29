import { TarStore } from './tar-store';
import { fetchWithRetries } from '../utils';

jest.mock('../utils', () => ({ fetchWithRetries: jest.fn() }));
jest.mock('isomorphic-untar-gzip', () => (x: any) => x);

describe('tar-store', () => {
  let tarStore;
  const content = 'package.json content';

  const getTar = (name) => ({
    arrayBuffer: () => [{ name, buffer: Buffer.from(content) }],
  });

  beforeEach(() => {
    tarStore = new TarStore();
  });

  it('Should be able to get "/package.json" from standard structured tar', async () => {
    fetchWithRetries.mockResolvedValueOnce(getTar('package/package.json'));
    const file = await tarStore.file('typescript', 'http://localhost:4000/typescript/-/typescript-4.0.2.tgz', '/package.json');
    expect(file).toEqual(content);
  });

  it('Should be able to get "/package.json" from non-standard structured tar', async () => {
    fetchWithRetries.mockResolvedValueOnce(getTar('parse-json/package.json'));
    const file = await tarStore.file('parse-json', 'http://localhost:4000/@types/parse-json/-/parse-json-4.0.2.tgz', '/package.json');
    expect(file).toEqual(content);
  });
});
