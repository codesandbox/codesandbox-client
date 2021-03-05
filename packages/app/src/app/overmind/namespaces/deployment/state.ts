import { NetlifySite, VercelDeployment } from '@codesandbox/common/lib/types';

type State = {
  vercelHasAlias: boolean;
  building: boolean;
  netlifyClaimUrl: string | null;
  netlifySite: NetlifySite | null;
  vercelDeploysBeingDeleted: string[];
  vercelDeployToDelete: string | null;
  deploying: boolean;
  vercelUrl: string | null;
  gettingDeploys: boolean;
  githubSite: {
    ghLogin: string;
    ghPages: boolean;
    name: string;
  };
  vercelDeploys: VercelDeployment[];
};

export const state: State = {
  vercelHasAlias: false,
  vercelDeploysBeingDeleted: [],
  vercelDeployToDelete: null,
  deploying: false,
  building: false,
  vercelUrl: null,
  gettingDeploys: true,
  vercelDeploys: [],
  netlifyClaimUrl: null,
  netlifySite: null,
  githubSite: {
    name: '',
    ghLogin: '',
    ghPages: false,
  },
};
