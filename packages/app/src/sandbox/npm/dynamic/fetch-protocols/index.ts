import { CSB_PKG_PROTOCOL } from '@codesandbox/common/lib/utils/ci';
import { CsbFetcher } from './csb';
import { UnpkgFetcher } from './unpkg';
import { JSDelivrNPMFetcher } from './jsdelivr/jsdelivr-npm';
import { JSDelivrGHFetcher } from './jsdelivr/jsdelivr-gh';
import { TarFetcher } from './tar';
import { FileFetcher } from './file';
import { GistFetcher } from './gist';

export const protocols = {
  csbGH: new CsbFetcher(),
  unpkg: new UnpkgFetcher(),
  jsDelivrNPM: new JSDelivrNPMFetcher(),
  jsDelivrGH: new JSDelivrGHFetcher(),
  tar: new TarFetcher(),
  file: new FileFetcher(),
  gist: new GistFetcher(),
};

export function getFetchProtocol(depVersion: string, useFallback = false) {
  if (depVersion.startsWith('file:')) {
    return protocols.file;
  }

  if (depVersion.startsWith('gist:')) {
    return protocols.gist;
  }

  const isDraftProtocol = CSB_PKG_PROTOCOL.test(depVersion);

  if (isDraftProtocol) {
    return protocols.csbGH;
  }

  if (depVersion.includes('http') && !depVersion.includes('github.com')) {
    return protocols.tar;
  }

  const isGitHub = /\//.test(depVersion);

  if (isGitHub) {
    return protocols.jsDelivrGH;
  }

  return useFallback ? protocols.unpkg : protocols.jsDelivrNPM;
}
