import * as React from 'react';
import { Input } from '@codesandbox/components';
import { AuthType, RegistryType } from 'app/graphql/types';
import { RegistryPresetProps } from '.';
import { CustomFormField } from '../RegistryForm';

export const NpmRegistryPreset = ({
  disabled,
  authKey,
  setAuthKey,
  setRegistryType,
  setAuthenticationType,
}: RegistryPresetProps) => {
  React.useEffect(() => {
    setRegistryType(RegistryType.Npm);
    setAuthenticationType(AuthType.Bearer);
  }, [setRegistryType]);

  return (
    <CustomFormField label="Access Token">
      <Input
        value={authKey}
        required
        onChange={e => setAuthKey(e.target.value)}
        disabled={disabled}
        type="password"
      />
    </CustomFormField>
  );
};
