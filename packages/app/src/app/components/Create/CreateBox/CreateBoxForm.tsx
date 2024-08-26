import styled from 'styled-components';
import React, { useEffect, useRef, useState } from 'react';
import {
  Stack,
  Element,
  Button,
  Text,
  Input,
  Icon,
  Select,
} from '@codesandbox/components';

import { useActions, useAppState, useEffects } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { PATHED_SANDBOXES_FOLDER_QUERY } from 'app/pages/Dashboard/queries';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { VMTier } from 'app/overmind/effects/api/types';
import { useQuery } from '@apollo/react-hooks';
import {
  PathedSandboxesFoldersQuery,
  PathedSandboxesFoldersQueryVariables,
} from 'app/graphql/types';
import { CreateParams, PrivacyLevel, SandboxToFork } from '../utils/types';

interface CreateBoxFormProps {
  template: SandboxToFork;
  initialPrivacy?: PrivacyLevel;
  collectionId: string | undefined;
  loading: boolean;
  setCollectionId: (collectionId: string | undefined) => void;
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
  onClose: () => void;
}

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  template,
  initialPrivacy,
  collectionId,
  loading,
  setCollectionId,
  onCancel,
  onSubmit,
}) => {
  const runsInTheBrowser =
    template.type === 'sandbox' || template.browserSandboxId;
  const runsOnVM = template.type === 'devbox';

  const [runtime, setRuntime] = useState<'browser' | 'vm'>(
    runsInTheBrowser ? 'browser' : 'vm'
  );

  const label = runtime === 'browser' ? 'Sandbox' : 'Devbox';

  const { activeTeamInfo, activeTeam, hasLogIn } = useAppState();
  const { signInClicked } = useActions();
  const { highestAllowedVMTier, isFrozen } = useWorkspaceLimits();
  const [name, setName] = useState<string>();
  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isFree } = useWorkspaceSubscription();

  const minimumPrivacy = Math.max(
    initialPrivacy ?? 2,
    activeTeamInfo?.settings.minimumPrivacy ?? 0
  ) as PrivacyLevel;

  const [permission, setPermission] = useState<PrivacyLevel>(minimumPrivacy);
  const [editor, setEditor] = useGlobalPersistedState<'csb' | 'vscode'>(
    'DEFAULT_EDITOR',
    'csb'
  );

  const defaultTier = isFree ? 1 : 2;
  const [selectedTier, setSelectedTier] = useState<number>(defaultTier);
  const [allVmTiers, setAllVmTiers] = useState<VMTier[]>([]);

  useEffect(() => {
    effects.api.getVMSpecs().then(res => {
      setAllVmTiers(res.vmTiers);
    });
  }, []);

  useEffect(() => {
    effects.api.getSandboxTitle().then(({ title }) => {
      if (nameInputRef.current) {
        setName(title);
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    });
  }, []);

  useEffect(() => {
    if (selectedTier > highestAllowedVMTier) {
      setSelectedTier(highestAllowedVMTier);
    }
  }, [selectedTier, highestAllowedVMTier]);

  const { data: collectionsData } = useQuery<
    PathedSandboxesFoldersQuery,
    PathedSandboxesFoldersQueryVariables
  >(PATHED_SANDBOXES_FOLDER_QUERY, {
    variables: {
      teamId: activeTeam,
    },
    skip: !activeTeam || !hasLogIn,
  });

  return (
    <Element
      as="form"
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingBottom: '16px',
        justifyContent: 'space-between',
      }}
      onSubmit={e => {
        e.preventDefault();

        onSubmit({
          sandboxId:
            runtime === 'browser'
              ? template.browserSandboxId ?? template.id
              : template.id,
          name,
          createAs: runtime === 'browser' ? 'sandbox' : 'devbox',
          permission,
          editor: runtime === 'browser' ? 'csb' : editor, // ensure 'csb' is always passed when creating a sandbox
          customVMTier:
            // Only pass customVMTier if user selects something else than the default
            allVmTiers.length > 0 && selectedTier !== defaultTier
              ? selectedTier
              : undefined,
        });
      }}
    >
      <Stack direction="vertical" gap={5}>
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
          }}
        >
          Configure
        </Text>
        <Stack direction="vertical" gap={2}>
          <Text size={3} as="label">
            Name
          </Text>
          <Input
            autoFocus
            id="sb-name"
            name="sb-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-describedby="name-desc"
            ref={nameInputRef}
          />
        </Stack>

        {hasLogIn && (
          <Stack gap={2} direction="vertical">
            <Stack gap={2}>
              <Stack style={{ flex: 2 }} direction="vertical" gap={2}>
                <Text size={3} as="label">
                  Visibility
                </Text>
                <Stack direction="vertical" gap={2}>
                  <Select
                    icon={PRIVACY_OPTIONS[permission].icon}
                    defaultValue={permission}
                    onChange={({ target: { value } }) =>
                      setPermission(parseInt(value, 10) as 0 | 1 | 2)
                    }
                    value={permission}
                  >
                    <option value={0}>{PRIVACY_OPTIONS[0].description}</option>
                    <option value={1}>{PRIVACY_OPTIONS[1].description}</option>
                    <option value={2}>{PRIVACY_OPTIONS[2].description}</option>
                  </Select>
                </Stack>
              </Stack>

              <Stack style={{ flex: 1 }} direction="vertical" gap={2}>
                <Text size={3} as="label">
                  Folder
                </Text>

                <Select
                  icon={() => <Icon name="folder" size={12} />}
                  value={collectionId}
                  onChange={({ target: { value } }) => {
                    if (value === 'drafts') {
                      setCollectionId(undefined);
                    } else {
                      setCollectionId(value);
                    }
                  }}
                >
                  <option key="drafts" value="drafts">
                    Drafts
                  </option>
                  {collectionsData?.me?.collections?.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.path === '/'
                        ? 'Root folder (/)'
                        : collection.path}
                    </option>
                  ))}
                </Select>
              </Stack>
            </Stack>
          </Stack>
        )}

        <Stack
          direction="vertical"
          align="flex-start"
          css={{ width: '100%' }}
          gap={2}
        >
          <Text size={3} as="label">
            Runtime
          </Text>

          <Stack gap={4}>
            <CardButton
              type="button"
              data-selected={runtime === 'browser'}
              onClick={() => setRuntime('browser')}
              disabled={!runsInTheBrowser}
            >
              <Stack direction="vertical" gap={2}>
                <Stack gap={1}>
                  <Stack css={{ width: 16, height: 16 }}>
                    <Icon
                      css={{ margin: 'auto' }}
                      color="#999"
                      size={14}
                      name="boxDevbox"
                    />
                  </Stack>
                  <Text size={3}>Sandbox</Text>
                </Stack>

                <Text size={3} variant="muted">
                  Ideal for prototyping and sharing code snippets. Runs on the
                  browser.
                </Text>

                {!runsInTheBrowser && (
                  <Text size={3} css={{ color: '#F7CC66' }}>
                    Not available for this template.
                  </Text>
                )}
              </Stack>
            </CardButton>

            <CardButton
              type="button"
              data-selected={runtime === 'vm'}
              onClick={() => setRuntime('vm')}
              disabled={!runsOnVM}
            >
              <Stack direction="vertical" gap={2}>
                <Stack gap={1}>
                  <Icon color="#999" size={16} name="server" />
                  <Text size={3}>Devbox</Text>
                </Stack>

                <Text size={3} variant="muted">
                  Ideal for any type of project, language or size. Runs on a
                  server.
                </Text>

                {!runsOnVM && (
                  <Text size={3} css={{ color: '#F7CC66' }}>
                    Not available for this template.
                  </Text>
                )}

                {!activeTeamInfo?.featureFlags.ubbBeta &&
                  activeTeamInfo?.subscription.status && (
                    <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
                      <Icon name="circleBang" />
                      <Text size={3}>
                        Better specs are available for our new team plan, you
                        can upgrade{' '}
                        <a
                          href="/upgrade"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          here
                        </a>
                        .
                      </Text>
                    </Stack>
                  )}
              </Stack>
            </CardButton>
          </Stack>
        </Stack>

        {runtime === 'vm' && (
          <>
            <Stack direction="vertical" gap={2}>
              <Text size={3} as="label">
                VM specs
              </Text>
              <Select
                value={selectedTier}
                onChange={e => setSelectedTier(parseInt(e.target.value, 10))}
              >
                {allVmTiers.map(t => (
                  <option
                    disabled={t.tier > highestAllowedVMTier}
                    key={t.shortid}
                    value={t.tier}
                  >
                    {t.name} ({t.cpu} vCPUs, {t.memory} GiB RAM, {t.storage} GB
                    Disk for {t.creditBasis} credits/hour)
                  </option>
                ))}
              </Select>
            </Stack>

            <Stack direction="vertical" gap={2}>
              <Text size={3} as="label">
                Open in
              </Text>

              <Select
                icon={EDITOR_ICONS[editor]}
                defaultValue={editor}
                onChange={({ target: { value } }) => setEditor(value)}
              >
                <option value="csb">
                  VS Code for the web (CodeSandbox.io)
                </option>
                <option value="vscode">
                  VS Code Desktop (CodeSandbox extension)
                </option>
              </Select>
            </Stack>
          </>
        )}
      </Stack>

      <Stack>
        <Stack gap={2} css={{ alignItems: 'center', width: '100%' }}>
          <Stack css={{ flex: 1 }}>
            {isFrozen && runtime === 'vm' && (
              <Text size={3} css={{ color: '#F7CC66' }}>
                You have run our of credits.
              </Text>
            )}
          </Stack>

          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            autoWidth
          >
            Cancel
          </Button>
          {hasLogIn ? (
            <Button
              type="submit"
              variant="primary"
              disabled={isFrozen && runtime === 'vm'}
              autoWidth
              loading={loading}
            >
              Create {label}
            </Button>
          ) : (
            <Button
              autoWidth
              onClick={() => signInClicked()}
              type="button"
              loading={loading}
            >
              Sign in to create {label}
            </Button>
          )}
        </Stack>
      </Stack>
    </Element>
  );
};

const PRIVACY_OPTIONS = {
  0: {
    description: 'Public (everyone can view)',
    icon: () => <Icon size={12} name="globe" />,
  },
  1: {
    description: 'Unlisted (everyone with the link can view)',
    icon: () => <Icon size={12} name="link" />,
  },
  2: {
    description: 'Private (only workspace members have access)',
    icon: () => <Icon size={12} name="lock" />,
  },
};

const EDITOR_ICONS = {
  csb: () => <Icon size={12} name="cloud" />,
  vscode: () => <Icon size={12} name="vscode" />,
};

const CardButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 16px;
  background: #1d1d1d;
  border: 1px solid transparent;
  text-align: left;
  font-family: inherit;
  border-radius: 4px;
  color: #e5e5e5;
  outline: none;
  display: flex;
  cursor: pointer;
  transition: all 100ms ease;

  &:hover:not(:disabled) {
    background: #252525;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &[data-selected='true'] {
    border-color: ${props => props.theme.colors.purple};
  }
`;
