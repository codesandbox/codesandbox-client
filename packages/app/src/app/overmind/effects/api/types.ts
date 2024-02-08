import { Sandbox } from '@codesandbox/common/lib/types';
import {
  CreditAddonType,
  SandboxAddonType,
  VMType,
} from 'app/overmind/namespaces/checkout/types';

export interface IModuleAPIResponse {
  id: string;
  shortid: string;
  code: string | null;
  directoryShortid: string | null;
  isBinary: boolean;
  sourceId: string;
  title: string;
  insertedAt: string;
  updatedAt: string;
}

export interface IDirectoryAPIResponse {
  id: string;
  shortid: string;
  directoryShortid: string | null;
  sourceId: string;
  title: string;
  insertedAt: string;
  updatedAt: string;
}

export interface AvatarAPIResponse {
  data: {
    id: string;
    url: string;
  };
}

export type SandboxAPIResponse = Omit<Sandbox, 'environmentVariables'> & {
  modules: IModuleAPIResponse[];
  directories: IDirectoryAPIResponse[];
};

export type FinalizeSignUpOptions = {
  id: string;
  name: string;
  username: string;
  role: string;
  usage: string;
  companyName: string;
  companySize: string;
};

export type MetaFeatures = {
  loginWithApple?: boolean;
  loginWithGithub?: boolean;
  loginWithGoogle?: boolean;
  loginWithWorkos?: boolean;
};

export type VMTier = {
  name: string;
  shortid: VMType;
  cpu: number;
  memory: number;
  storage: number;
  creditBasis: number;
};

export type APIPricingResult = {
  addons: Record<
    CreditAddonType | SandboxAddonType,
    { credits: number; cost_month: number; sandboxes: number }
  >;
  base: {
    flex: {
      cost_month: number;
      credits: number;
      drafts: number;
      members: number;
      sandboxes: number;
      storage: number;
      vm_tier: number;
    };
  };
};
