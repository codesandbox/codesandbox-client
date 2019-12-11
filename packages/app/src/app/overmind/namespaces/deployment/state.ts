import { NetlifySite, ZeitDeployment } from '@codesandbox/common/lib/types';

type State = {
  hasAlias: boolean;
  building: boolean;
  netlifyClaimUrl: string;
  netlifyLogs: string;
  netlifySite: NetlifySite;
  deploysBeingDeleted: string[];
  deployToDelete: string;
  deploying: boolean;
  url: string;
  gettingDeploys: boolean;
  sandboxDeploys: ZeitDeployment[];
};

export const state: State = {
  hasAlias: false,
  deploysBeingDeleted: [],
  deployToDelete: null,
  deploying: false,
  building: false,
  url: null,
  gettingDeploys: true,
  sandboxDeploys: [],
  netlifyLogs: null,
  netlifyClaimUrl: null,
  netlifySite: null,
};
