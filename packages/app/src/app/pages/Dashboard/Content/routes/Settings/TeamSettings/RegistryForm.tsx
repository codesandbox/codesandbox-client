import React from 'react';
import {
  Stack,
  Select,
  Input,
  Text,
  FormField,
  Button,
  IconButton,
} from '@codesandbox/components';
import {
  CreateOrUpdateNpmRegistryMutationVariables,
  NpmRegistryFragment,
  RegistryType,
} from 'app/graphql/types';

import css from '@styled-system/css';
import { useTheme } from 'styled-components';
import Media from 'react-media';

const CustomFormField = (props: React.ComponentProps<typeof FormField>) => (
  <FormField
    css={css({ paddingX: 0, label: { marginBottom: 1 } })}
    direction={props.direction || 'vertical'}
    label={props.label}
  >
    {props.children}
  </FormField>
);

export type CreateTeamParams = Omit<
  CreateOrUpdateNpmRegistryMutationVariables,
  'teamId'
>;

type RegistryFormProps = {
  registry: NpmRegistryFragment | null;
  onSubmit: (params: CreateTeamParams) => void;
  isSubmitting: boolean;
  disabled?: boolean;
};

export const RegistryForm = ({
  registry,
  onSubmit,
  isSubmitting,
  disabled,
}: RegistryFormProps) => {
  const theme = useTheme() as any;

  const [registryType, setRegistryType] = React.useState<RegistryType>(
    registry?.registryType || RegistryType.Npm
  );
  // eslint-disable-next-line
  const [isLimitedToScopes, setIsLimitedToScopes] = React.useState<boolean>(
    registry?.limitToScopes || true
  );
  const [authKey, setAuthKey] = React.useState<string>(
    registry?.registryAuthKey || ''
  );
  const [registryUrl, setRegistryUrl] = React.useState<string>(
    registry?.registryUrl || ''
  );
  const [scopes, setScopes] = React.useState<string[]>(
    registry?.enabledScopes || []
  );

  const addScope = () => {
    setScopes(oldScopes => [...oldScopes, '']);
  };

  const removeScope = (index: number) => {
    setScopes(oldScopes => oldScopes.filter((_is, i) => i !== index));
  };

  const editScope = (scope: string, index: number) => {
    setScopes(s => {
      const copiedScopes = [...s];
      copiedScopes[index] = scope;
      return copiedScopes;
    });
  };

  const serializeValues = (): CreateTeamParams => ({
    registryAuthKey: authKey,
    registryType,
    limitToScopes: isLimitedToScopes,
    enabledScopes: scopes.filter(s => s !== ''),
    registryUrl,
    proxyEnabled: true,
  });

  return (
    <Media query={`(min-width: ${theme.breakpoints[2]})`}>
      {isHorizontal => (
        <Stack
          onSubmit={e => {
            e.preventDefault();
            onSubmit(serializeValues());
          }}
          as="form"
          gap={8}
          css={css({ width: '100%' })}
          direction="vertical"
        >
          <Stack
            css={css({ width: '100%' })}
            direction={isHorizontal ? 'horizontal' : 'vertical'}
            gap={13}
          >
            <Stack css={css({ width: '100%' })} gap={5} direction="vertical">
              <Text size={4}>Registry</Text>

              <CustomFormField label="Registry Host">
                <Select
                  value={registryType}
                  onChange={e => {
                    setRegistryType(e.target.value);
                  }}
                  disabled={disabled}
                >
                  {Object.keys(RegistryType).map(type => (
                    <option value={RegistryType[type]} key={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </CustomFormField>

              {registryType === RegistryType.Custom && (
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
                    Is your registry behind a VPN? Please read here: ...
                  </Text>
                </div>
              )}

              <CustomFormField label="Auth Token">
                <Input
                  value={authKey}
                  required
                  onChange={e => setAuthKey(e.target.value)}
                  disabled={disabled}
                />
              </CustomFormField>
            </Stack>
            <Stack
              align="center"
              justify="center"
              css={css(isHorizontal ? { marginY: 20 } : { marginX: 20 })}
            >
              <hr
                css={css({
                  backgroundColor: 'grays.500',
                  border: 0,
                  outline: 0,

                  ...(isHorizontal
                    ? { width: '1px', minHeight: '225px', height: '100%' }
                    : { height: '1px', width: '100%' }),
                })}
              />
            </Stack>
            <Stack css={css({ width: '100%' })} gap={5} direction="vertical">
              <Text size={4}>Scopes</Text>

              {/* <div>
                <CustomFormField
                  direction="horizontal"
                  label="Enable registry for specific npm scopes"
                >
                  <Switch
                    onChange={() => {
                      setIsLimitedToScopes(s => !s);
                    }}
                    on={isLimitedToScopes}
                    disabled={disabled}
                  />
                </CustomFormField>
                <Text size={3} variant="muted">
                  Enabling the registry for specific scopes will improve sandbox
                  load performance.
                </Text>
              </div> */}

              {isLimitedToScopes && (
                <CustomFormField label="Enabled Scopes">
                  <Stack
                    gap={2}
                    css={css({ width: '100%', marginTop: 2 })}
                    direction="vertical"
                  >
                    {scopes.map((scope, i) => (
                      <Stack
                        align="center"
                        direction="horizontal"
                        css={css({ width: '100%' })}
                      >
                        <Input
                          required
                          pattern="@\w+"
                          css={css({ width: '100%' })}
                          placeholder="@acme"
                          disabled={disabled}
                          value={scope}
                          onInput={e => {
                            if (e.target.validity.patternMismatch) {
                              e.target.setCustomValidity(
                                "Scope has to start with an '@' and have no slashes"
                              );
                            } else {
                              e.target.setCustomValidity('');
                            }
                          }}
                          onChange={e => {
                            editScope(e.target.value, i);
                          }}
                        />
                        <IconButton
                          onClick={() => {
                            removeScope(i);
                          }}
                          title="Remove Scope"
                          size={9}
                          name="cross"
                          disabled={disabled}
                        />
                      </Stack>
                    ))}

                    <Button
                      variant="link"
                      disabled={disabled}
                      type="submit"
                      onClick={e => {
                        addScope();
                      }}
                      autoWidth
                    >
                      Add Scope
                    </Button>
                  </Stack>
                </CustomFormField>
              )}
            </Stack>
          </Stack>

          <Stack gap={2} justify="flex-end" css={css({ width: '100%' })}>
            <Button disabled={disabled} autoWidth variant="secondary">
              Cancel
            </Button>
            <Button
              loading={isSubmitting}
              type="submit"
              css={css({ width: '120px' })}
              variant="primary"
              disabled={disabled}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      )}
    </Media>
  );
};
