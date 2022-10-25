import { Sandbox } from '@codesandbox/common/lib/types';

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
};
