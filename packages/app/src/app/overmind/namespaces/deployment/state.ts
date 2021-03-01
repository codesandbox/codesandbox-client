import { NetlifySite, VercelDeployment } from '@codesandbox/common/lib/types';

type State = {
  hasAlias: boolean;
  building: boolean;
  netlifyClaimUrl: string | null;
  netlifySite: NetlifySite | null;
  deploysBeingDeleted: string[];
  deployToDelete: string | null;
  deploying: boolean;
  url: string | null;
  gettingDeploys: boolean;
  sandboxDeploys: VercelDeployment[];
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
  netlifyClaimUrl: null,
  netlifySite: null,
};
