import * as React from 'react';
import { Select, Input, Text, Link } from '@codesandbox/components';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { AuthType, RegistryType } from 'app/graphql/types';
import { RegistryPresetProps } from '.';
import { CustomFormField } from '../RegistryForm';
import { UsernamePassword } from './UsernamePassword';

export const CustomRegistryPreset = ({
  registryUrl,
  setRegistryUrl,
  disabled,
  authenticationType,
  setAuthenticationType,
  authKey,
  setAuthKey,
  setRegistryType,
}: RegistryPresetProps) => {
  React.useEffect(() => {
    setRegistryType(RegistryType.Custom);
    setAuthenticationType(AuthType.Basic);
  }, [setRegistryType]);

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

      <div>
        <CustomFormField label="Auth Type">
          <Select
            value={authenticationType}
            onChange={e => {
              setAuthenticationType(e.target.value);
            }}
            disabled={disabled}
          >
            {Object.keys(AuthType).map(type => (
              <option value={AuthType[type]} key={type}>
                {type}
              </option>
            ))}
          </Select>
        </CustomFormField>
        <Text size={3} variant="muted">
          More information on which one to choose can be found{' '}
          <Link
            href={docsUrl('/learn/sandboxes/custom-npm-registry#auth-token')}
            target="_blank"
            variant="active"
          >
            here
          </Link>
          .
        </Text>
      </div>

      {authenticationType === AuthType.Basic ? (
        <UsernamePassword
          authKey={authKey}
          disabled={disabled}
          setAuthKey={setAuthKey}
        />
      ) : (
        <CustomFormField label="Auth Token">
          <Input
            value={authKey}
            required
            onChange={e => setAuthKey(e.target.value)}
            disabled={disabled}
            type="password"
          />
        </CustomFormField>
      )}
    </>
  );
};
