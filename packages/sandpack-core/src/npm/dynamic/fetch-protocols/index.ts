import { CSB_PKG_PROTOCOL } from '@codesandbox/common/lib/utils/ci';
import { CsbFetcher } from './csb';
import { UnpkgFetcher } from './unpkg';
import { JSDelivrNPMFetcher } from './jsdelivr/jsdelivr-npm';
import { JSDelivrGHFetcher } from './jsdelivr/jsdelivr-gh';
import { TarFetcher } from './tar';
import { GistFetcher } from './gist';
import { FetchProtocol } from '../fetch-npm-module';

let contributedProtocols: ProtocolDefinition[] = [];

export const preloadedProtocols = {
  jsdelivr: new JSDelivrNPMFetcher(),
  unpkg: new UnpkgFetcher(),
};

const protocols: ProtocolDefinition[] = [
  {
    protocol: new GistFetcher(),
    condition: version => version.startsWith('gist:'),
  },
  {
    protocol: new CsbFetcher(),
    condition: version => CSB_PKG_PROTOCOL.test(version),
  },
  {
    protocol: new TarFetcher(),
    condition: version =>
      version.includes('http') && !version.includes('github.com'),
  },
  {
    protocol: new JSDelivrGHFetcher(),
    condition: version => /\//.test(version),
  },
  {
    protocol: preloadedProtocols.unpkg,
    condition: (version, useFallback) => useFallback,
  },
  { protocol: preloadedProtocols.jsdelivr, condition: () => true },
];

export type ProtocolDefinition = {
  protocol: FetchProtocol;
  condition: ProtocolCondition;
};

export type ProtocolCondition = (
  version: string,
  useFallback: boolean
) => boolean;

export function setContributedProtocols(protocols: ProtocolDefinition[]) {
  contributedProtocols = protocols;
}

export function getFetchProtocol(depVersion: string, useFallback = false) {
  const runCondition = (p: ProtocolDefinition) =>
    p.condition(depVersion, useFallback);

  return (
    contributedProtocols.find(runCondition)?.protocol ||
    protocols.find(runCondition)!.protocol
  );
}
