export type ZeitAlias = {
  alias: string;
  created: string;
  uid: string;
};

export type ZeitConfig = {
  name?: string;
  alias?: string;
};

export type ZeitCreator = {
  uid: string;
};

export type ZeitDeployment = {
  uid: string;
  name: string;
  url: string;
  created: number;
  state: ZeitDeploymentState;
  instanceCount: number;
  alias: ZeitAlias[];
  scale: ZeitScale;
  createor: ZeitCreator;
  type: ZeitDeploymentType;
};

export enum ZeitDeploymentState {
  DEPLOYING = 'DEPLOYING',
  INITIALIZING = 'INITIALIZING',
  DEPLOYMENT_ERROR = 'DEPLOYMENT_ERROR',
  BOOTED = 'BOOTED',
  BUILDING = 'BUILDING',
  READY = 'READY',
  BUILD_ERROR = 'BUILD_ERROR',
  FROZEN = 'FROZEN',
  ERROR = 'ERROR',
}

export enum ZeitDeploymentType {
  'NPM',
  'DOCKER',
  'STATIC',
  'LAMBDAS',
}

export type ZeitScale = {
  current: number;
  min: number;
  max: number;
};

export type ZeitUser = {
  uid: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  platformVersion: number;
  billing: {
    plan: string;
    period: string;
    trial: string;
    cancelation: string;
    addons: string;
  };
  bio: string;
  website: string;
  profiles: Array<{
    service: string;
    link: string;
  }>;
};
