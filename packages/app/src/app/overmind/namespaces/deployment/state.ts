import { NetlifySite, ZeitDeployment } from '@codesandbox/common/lib/types';

type State = {
  hasAlias: boolean;
  building: boolean;
  netlifyClaimUrl: string;
  netlifyLogs: string;
  netlifySite: NetlifySite;
  deployToDelete: string;
  deploying: boolean;
  url: string;
  gettingDeploys: boolean;
  sandboxDeploys: ZeitDeployment[];
  isDeletingDeployment: boolean;
};

export const state: State = {
  hasAlias: false,
  isDeletingDeployment: false,
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
