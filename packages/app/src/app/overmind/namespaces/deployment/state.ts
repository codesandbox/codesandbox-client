import { NetlifySite, VercelDeployment } from '@codesandbox/common/lib/types';

type State = {
  deploying: boolean;
  building: boolean;
  vercel: {
    gettingDeploys: boolean;
    deploys: VercelDeployment[];
    deploysBeingDeleted: string[];
    deployToDelete: string | null;
    url: string | null;
  };
  netlify: {
    claimUrl: string | null;
    site: NetlifySite | null;
  };
  githubSite: {
    ghLogin: string;
    ghPages: boolean;
    name: string;
  };
};

export const state: State = {
  deploying: false,
  building: false,
  vercel: {
    deploys: [],
    deploysBeingDeleted: [],
    deployToDelete: null,
    url: null,
    gettingDeploys: true,
  },
  netlify: {
    claimUrl: null,
    site: null,
  },
  githubSite: {
    name: '',
    ghLogin: '',
    ghPages: false,
  },
};
