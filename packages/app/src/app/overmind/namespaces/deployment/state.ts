type Creator = {
  uid: string;
};

type Scale = {
  current: number;
  min: number;
  max: number;
};

type Alias = {
  alias: string;
  created: string;
  uid: string;
};

enum DeployState {
  'DEPLOYING',
  'INITIALIZING',
  'DEPLOYMENT_ERROR',
  'BOOTED',
  'BUILDING',
  'READY',
  'BUILD_ERROR',
  'FROZEN',
  'ERROR',
}

enum DeployType {
  'NPM',
  'DOCKER',
  'STATIC',
  'LAMBDAS',
}

type Deploy = {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: DeployState;
  instanceCount: number;
  alias: Alias[];
  scale: Scale;
  createor: Creator;
  type: DeployType;
};

export type NetlifySite = {
  id: string;
  site_id: string;
  name: string;
  url: string;
  state: string;
  screenshot_url: string;
  sandboxId: string;
};

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
  sandboxDeploys: Deploy[];
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
