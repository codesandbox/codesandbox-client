import * as React from 'react';
import { Input, Link, Text } from '@codesandbox/components';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { AuthType, RegistryType } from 'app/graphql/types';
import { RegistryPresetProps } from '.';
import { CustomFormField } from '../RegistryForm';

export const ArtifactoryRegistryPreset = ({
  registryUrl,
  setRegistryUrl,
  disabled,
  setAuthenticationType,
  authKey,
  setAuthKey,
  setRegistryType,
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
            href={docsUrl('/learn/sandboxes/custom-npm-registry')}
            target="_blank"
            variant="active"
          >
            docs
          </Link>
          .
        </Text>
      </div>

      <CustomFormField label="Access Token (found after _auth= in `.npmrc`)">
        <Input
          value={authKey}
          required
          onChange={e => setAuthKey(e.target.value)}
          disabled={disabled}
          type="password"
        />
      </CustomFormField>
    </>
  );
};
