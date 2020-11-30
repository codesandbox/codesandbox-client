import { Sandbox } from '@codesandbox/common/lib/types';
import { NpmRegistryFetcher } from 'sandpack-core/lib/npm/dynamic/fetch-protocols/npm-registry';

type Output = {
  dtsFiles: { [p: string]: { module: { code: string } } };
  dependencies: Array<{ name: string; version: string }>;
};

/**
 * Fetches the tar of the private dependency from the server, extracts it in memory and filters out the type
 * files.
 */
export async function fetchPrivateDependency(
  sandbox: Sandbox,
  name: string,
  version: string
): Promise<Output> {
  // TODO: add support for multiple registries
  const cleanUrl = sandbox.npmRegistries[0].registryUrl.replace(/\/$/, '');

  const fetcher = new NpmRegistryFetcher(cleanUrl, {
    // With our custom proxy on the server we want to handle downloading
    // the tarball. So we proxy it.
    provideTarballUrl: (n: string, v: string) =>
      `${cleanUrl}/${n.replace('/', '%2f')}/${v}`,
  });

  const meta = await fetcher.meta(name, version);
  const validFilePaths = Object.keys(meta).filter(
    file => file.endsWith('.ts') || file.endsWith('/package.json')
  );
  const validFiles = {};

  await Promise.all(
    validFilePaths.map(async filePath => {
      const file = await fetcher.file(name, version, filePath);
      validFiles[`/${name}${filePath}`] = { module: { code: file } };
    })
  );

  const packageJSONPath = `/package.json`;
  const packageJSONCode = await fetcher.file(name, version, packageJSONPath);
  const deps: { [dep: string]: string } = JSON.parse(packageJSONCode)
    .dependencies;
  const depArray = Object.keys(deps).map(depName => ({
    name: depName,
    version: deps[depName],
  }));

  return { dtsFiles: validFiles, dependencies: depArray };
}
