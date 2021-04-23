import * as React from 'react';
import { Input, Link, Text } from '@codesandbox/components';
import { AuthType, RegistryType } from 'app/graphql/types';
import { RegistryPresetProps } from '.';
import { CustomFormField } from '../RegistryForm';

export const AzureRegistryPreset = ({
  registryUrl,
  setRegistryUrl,
  disabled,
  setAuthenticationType,
  setAuthKey,
  setRegistryType,
}: RegistryPresetProps) => {
  React.useEffect(() => {
    setRegistryType(RegistryType.Custom);
    setAuthenticationType(AuthType.Basic);
  }, [setRegistryType, setAuthenticationType]);

  const [username, setUsername] = React.useState('');
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    if (!username || !token) {
      return;
    }

    // First unencode the token, this is what npm does as well
    const unencodedToken = Buffer.from(token, 'base64').toString('utf-8');

    const key = `${username}:${unencodedToken}`;
    const base64Data = Buffer.from(key);
    const authKey = base64Data.toString('base64');
    setAuthKey(authKey);
  }, [username, token, setAuthKey]);

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
            href="https://codesandbox.io/docs/custom-npm-registry"
            target="_blank"
            variant="active"
          >
            docs
          </Link>
          .
        </Text>
      </div>

      <CustomFormField label="Username">
        <Input
          value={username}
          required
          onChange={e => setUsername(e.target.value)}
          disabled={disabled}
        />
      </CustomFormField>

      <CustomFormField label="Access Token (base64 encoded)">
        <Input
          value={token}
          required
          onChange={e => setToken(e.target.value)}
          disabled={disabled}
          type="password"
        />
      </CustomFormField>
    </>
  );
};
