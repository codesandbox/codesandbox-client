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
    condition: (name, version) => version.startsWith('gist:'),
  },
  {
    protocol: new CsbFetcher(),
    condition: (name, version) => CSB_PKG_PROTOCOL.test(version),
  },
  {
    protocol: new TarFetcher(),
    condition: (name, version) =>
      version.includes('http') && !version.includes('github.com'),
  },
  {
    protocol: new JSDelivrGHFetcher(),
    condition: (name, version) => /\//.test(version),
  },
  {
    protocol: preloadedProtocols.unpkg,
    condition: (_name, _version, useFallback) => useFallback,
  },
  { protocol: preloadedProtocols.jsdelivr, condition: () => true },
];

export type ProtocolDefinition = {
  protocol: FetchProtocol;
  condition: ProtocolCondition;
};

export type ProtocolCondition = (
  version: string,
  name: string,
  useFallback: boolean
) => boolean;

export function setContributedProtocols(newProtocols: ProtocolDefinition[]) {
  contributedProtocols = newProtocols;
  return contributedProtocols;
}

export function prependToContributedProtocols(
  newProtocols: ProtocolDefinition[]
) {
  contributedProtocols.unshift(...newProtocols);
  return contributedProtocols;
}

export function getFetchProtocol(
  depName: string,
  depVersion: string,
  useFallback = false
) {
  const runCondition = (p: ProtocolDefinition) =>
    p.condition(depName, depVersion, useFallback);

  return (
    contributedProtocols.find(runCondition)?.protocol ||
    protocols.find(runCondition)!.protocol
  );
}
