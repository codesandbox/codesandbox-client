import React from 'react';
import {
  Stack,
  Select,
  Input,
  Text,
  FormField,
  Button,
  IconButton,
  Icon,
  Link,
  Tooltip,
} from '@codesandbox/components';
import {
  AuthType,
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

export type CreateRegistryParams = Omit<
  CreateOrUpdateNpmRegistryMutationVariables,
  'teamId'
>;

type RegistryFormProps = {
  registry: NpmRegistryFragment | null;
  onCancel: () => void;
  onSubmit: (params: CreateRegistryParams) => void;
  isSubmitting: boolean;
  disabled?: boolean;
};

const nameMap = {
  Github: 'GitHub',
  Npm: 'npm',
  Custom: 'Custom',
};

export const RegistryForm = ({
  registry,
  onCancel,
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
  // eslint-disable-next-line
  const [authenticationType, setAuthenticationType] = React.useState<AuthType>(
    registry?.authType || AuthType.Bearer
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

  const serializeValues = (): CreateRegistryParams => ({
    registryAuthKey: authKey,
    registryType,
    limitToScopes: isLimitedToScopes,
    enabledScopes: scopes.filter(s => s !== ''),
    registryAuthType: authenticationType,
    registryUrl,
    proxyEnabled: true,
  });

  // We make sure to always show one input field
  const prefilledScopes = scopes.length === 0 ? [''] : scopes;

  return (
    <Media query={`(min-width: ${theme.breakpoints[2]})`}>
      {isHorizontal => (
        <Stack
          onSubmit={e => {
            e.preventDefault();
            onSubmit(serializeValues());
          }}
          as="form"
          autoComplete="false"
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
              <Stack gap={2} align="center">
                <Text weight="bold" size={4}>
                  Registry
                </Text>

                <Link
                  href="https://codesandbox.io/docs/custom-npm-registry"
                  target="_blank"
                  rel="noreferrer noopener"
                  css={css({
                    color: 'grays.400',
                  })}
                >
                  <Tooltip label="Documentation">
                    <div
                      css={css({
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      })}
                    >
                      <Icon aria-label="Documentation" size={12} name="info" />
                    </div>
                  </Tooltip>
                </Link>
              </Stack>

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
                      {nameMap[type] || type}
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
                    Is your registry behind a VPN? Please read these{' '}
                    <a
                      href="https://codesandbox.io/docs/custom-npm-registry"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      docs
                    </a>
                    .
                  </Text>
                </div>
              )}

              {registryType === RegistryType.Custom && (
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
                    <a
                      href="https://codesandbox.io/docs/custom-npm-registry#auth-token"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      here
                    </a>
                    .
                  </Text>
                </div>
              )}

              <CustomFormField label="Auth Token">
                <Input
                  value={authKey}
                  required
                  onChange={e => setAuthKey(e.target.value)}
                  disabled={disabled}
                  type="password"
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
              <Text weight="bold" size={4}>
                Scopes
              </Text>

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
                    css={css({ width: '100%' })}
                    direction="vertical"
                  >
                    {prefilledScopes.map((scope, i) => (
                      <Stack
                        align="center"
                        direction="horizontal"
                        css={css({ width: '100%' })}
                      >
                        <Input
                          required
                          pattern="@[\w-_]+"
                          css={css({ width: '100%' })}
                          placeholder="Enter a scope (@acme)"
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
                          onBlur={e => {
                            if (e.target.value.trim() === '') {
                              removeScope(i);
                            }
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
            <Button
              onClick={() => {
                onCancel();
              }}
              disabled={disabled}
              autoWidth
              variant="secondary"
            >
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
