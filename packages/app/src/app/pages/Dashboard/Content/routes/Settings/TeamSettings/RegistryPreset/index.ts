import { AuthType, RegistryType } from 'app/graphql/types';
import { ArtifactoryRegistryPreset } from './Artifactory';
import { AzureRegistryPreset } from './Azure';
import { CustomRegistryPreset } from './Custom';
import { GitHubPreset } from './GitHub';
import { NpmRegistryPreset } from './Npm';

export enum RegistryPreset {
  npm = 'npm',
  GitHub = 'GitHub',
  Azure = 'Azure DevOps',
  Artifactory = 'Artifactory',
  Custom = 'Custom',
}

export type RegistryInformation = {
  url: string;
  authKey: string;
  authenticationType: AuthType;
};

export type RegistryPresetProps = {
  registryType: RegistryType;
  registryUrl: string;
  authKey: string;
  authenticationType: AuthType;

  setRegistryType: (type: RegistryType) => void;
  setRegistryUrl: (url: string) => void;
  setAuthenticationType: (type: AuthType) => void;
  setAuthKey: (key: string) => void;

  disabled: boolean;
};

export const getFormFromPreset = (
  preset: RegistryPreset
): React.FC<RegistryPresetProps> => {
  const mapping = {
    [RegistryPreset.npm]: NpmRegistryPreset,
    [RegistryPreset.GitHub]: GitHubPreset,
    [RegistryPreset.Azure]: AzureRegistryPreset,
    [RegistryPreset.Artifactory]: ArtifactoryRegistryPreset,
    [RegistryPreset.Custom]: CustomRegistryPreset,
  };

  return mapping[preset];
};
