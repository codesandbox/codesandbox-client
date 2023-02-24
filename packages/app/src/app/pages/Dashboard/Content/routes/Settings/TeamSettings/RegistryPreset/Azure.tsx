import * as React from 'react';
import { Input, Link, Text } from '@codesandbox/components';
import { AuthType, RegistryType } from 'app/graphql/types';
import { RegistryPresetProps } from '.';
import { CustomFormField } from '../RegistryForm';
import { UsernamePassword } from './UsernamePassword';

export const AzureRegistryPreset = ({
  registryUrl,
  setRegistryUrl,
  disabled,
  setAuthenticationType,
  setAuthKey,
  setRegistryType,
  authKey,
}: RegistryPresetProps) => {
  React.useEffect(() => {
    setRegistryType(RegistryType.Custom);
    setAuthenticationType(AuthType.Basic);
  }, [setRegistryType, setAuthenticationType]);

  return (
    <>
      <div>
        <CustomFormField label="Registry URL">
          <Input
            value={registryUrl}
            onChange={e => setRegistryUrl(e.target.value)}
            required
            pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
            disabled={disabled}
          />
        </CustomFormField>
        <Text size={3} variant="muted">
          Is your registry behind a VPN? Please read these{' '}
          <Link
            href="https://codesandbox.io/docs/learn/sandboxes/custom-npm-registry"
            target="_blank"
            variant="active"
          >
            docs
          </Link>
          .
        </Text>
      </div>

      <UsernamePassword
        authKey={authKey}
        setAuthKey={setAuthKey}
        disabled={disabled}
      />
    </>
  );
};
