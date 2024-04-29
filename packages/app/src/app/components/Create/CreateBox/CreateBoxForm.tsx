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
import { CreateParams, PrivacyLevel } from '../utils/types';

interface CreateBoxFormProps {
  type: 'sandbox' | 'devbox';
  initialPrivacy?: PrivacyLevel;
  collectionId: string | undefined;
  setCollectionId: (collectionId: string | undefined) => void;
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
  onClose: () => void;
}

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  type,
  initialPrivacy,
  collectionId,
  setCollectionId,
  onCancel,
  onSubmit,
  onClose,
}) => {
  const label = type === 'sandbox' ? 'Sandbox' : 'Devbox';

  const { activeTeamInfo, activeTeam, hasLogIn } = useAppState();
  const { signInClicked } = useActions();
  const {
    hasReachedPrivateSandboxLimit,
    highestAllowedVMTier,
  } = useWorkspaceLimits();
  const [name, setName] = useState<string>();
  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isFree } = useWorkspaceSubscription();
  const isDraft = collectionId === undefined;

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
  const canCreate =
    isDraft || !(permission === 2 && hasReachedPrivateSandboxLimit);

  useEffect(() => {
    if (type === 'devbox') {
      effects.api.getVMSpecs().then(res => {
        setAllVmTiers(res.vmTiers);
      });
    }
  }, [type]);

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

  const rootCollection = collectionsData?.me?.collections?.find(
    collection => collection.path === '/'
  );
  useEffect(() => {
    if (collectionsData?.me?.collections == null) {
      return;
    }

    if (permission < 2) {
      if (collectionId == null && rootCollection != null) {
        setCollectionId(rootCollection.id);
      }
    }
  }, [
    collectionsData,
    rootCollection,
    permission,
    collectionId,
    setCollectionId,
  ]);

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
          name,
          createAs: type,
          permission: isDraft ? undefined : permission,
          editor: type === 'sandbox' ? 'csb' : editor, // ensure 'csb' is always passed when creating a sandbox
          customVMTier:
            // Only pass customVMTier if user selects something else than the default
            allVmTiers.length > 0 && selectedTier !== defaultTier
              ? selectedTier
              : undefined,
        });
      }}
    >
      <Stack direction="vertical" gap={6}>
        <Text
          as="h2"
          css={{
            fontSize: '16px',
            fontWeight: 500,
            margin: 0,
          }}
        >
          Create {label}
        </Text>
        <Stack direction="vertical" gap={2}>
          <Text size={3} as="label">
            {label} Name
          </Text>
          <Input
            autoFocus
            id="sb-name"
            name="sb-name"
            type="text"
            value={name}
            placeholder={`Let's give this ${label} a name.`}
            onChange={e => setName(e.target.value)}
            aria-describedby="name-desc"
            ref={nameInputRef}
          />
        </Stack>

        {hasLogIn && (
          <Stack gap={2} direction="vertical">
            <Stack gap={2}>
              <Stack style={{ flex: 1 }} direction="vertical" gap={2}>
                <Text size={3} as="label">
                  Folder
                </Text>

                <Select
                  icon={() => (
                    <Icon name={isDraft ? 'file' : 'folder'} size={12} />
                  )}
                  value={isDraft ? '$CSBDRAFTS' : collectionId}
                  onChange={({ target: { value } }) => {
                    if (value === '$CSBDRAFTS') {
                      setCollectionId(undefined);
                      setPermission(2);
                    } else {
                      setCollectionId(value);
                    }
                  }}
                >
                  <option value="$CSBDRAFTS">Drafts</option>

                  {collectionsData?.me?.collections?.map(collection => (
                    <option value={collection.id}>
                      {collection.path === '/'
                        ? 'Root folder (/)'
                        : collection.path}
                    </option>
                  ))}
                </Select>
              </Stack>

              <Stack style={{ flex: 2 }} direction="vertical" gap={2}>
                <Text size={3} as="label">
                  Visibility
                </Text>
                <Stack direction="vertical" gap={2}>
                  <Select
                    icon={
                      isDraft
                        ? PRIVACY_OPTIONS[2].icon
                        : PRIVACY_OPTIONS[permission].icon
                    }
                    defaultValue={permission}
                    onChange={({ target: { value } }) => {
                      if (value === 'DRAFT') {
                        setCollectionId(undefined);
                        setPermission(2);
                      } else {
                        setPermission(parseInt(value, 10) as 0 | 1 | 2);
                        if (collectionId == null) {
                          setCollectionId(rootCollection?.id);
                        }
                      }
                    }}
                    value={isDraft ? 'DRAFT' : permission}
                  >
                    <option value={0}>{PRIVACY_OPTIONS[0].description}</option>
                    <option value={1}>{PRIVACY_OPTIONS[1].description}</option>
                    <option value={2}>{PRIVACY_OPTIONS[2].description}</option>
                    <option value="DRAFT">Draft (only you have access)</option>
                  </Select>
                </Stack>
              </Stack>
            </Stack>

            {isDraft && (
              <Stack gap={1} css={{ color: '#A8BFFA' }}>
                <Icon name="circleBang" />
                <Text size={3}>
                  Drafts are private and only visible to you.
                </Text>
              </Stack>
            )}

            {!isDraft && !canCreate && (
              <Stack gap={1} css={{ color: '#F5A8A8' }}>
                <Icon name="circleBang" />
                <Text size={3}>
                  You have reached the free limit of 5 {label}.
                </Text>
              </Stack>
            )}
          </Stack>
        )}

        <Stack direction="vertical" gap={2}>
          <Text size={3} as="label">
            Open in
          </Text>
          {type === 'sandbox' ? (
            <>
              <Input
                css={{ cursor: 'not-allowed' }}
                value="CodeSandbox Web Editor"
                disabled
              />
              <Stack gap={1} css={{ color: '#A8BFFA' }}>
                <Icon name="circleBang" />
                <Text size={3}>
                  Sandboxes can only be opened in the web editor.
                </Text>
              </Stack>
            </>
          ) : (
            <Select
              icon={EDITOR_ICONS[editor]}
              defaultValue={editor}
              onChange={({ target: { value } }) => setEditor(value)}
            >
              <option value="csb">CodeSandbox Web Editor</option>
              <option value="vscode">
                VS Code Desktop (Using the CodeSandbox extension)
              </option>
            </Select>
          )}
        </Stack>

        <Stack direction="vertical" align="flex-start" gap={2}>
          <Text size={3} as="label">
            Runtime
          </Text>
          {type === 'sandbox' ? (
            <>
              <Input css={{ cursor: 'not-allowed' }} value="Browser" disabled />
              <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
                <Icon name="circleBang" />
                <Text size={3}>Sandboxes run in your browser.</Text>
              </Stack>
            </>
          ) : (
            <>
              <Select
                value={selectedTier}
                disabled={allVmTiers.length === 0}
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
              {isFree && (
                <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
                  <Icon name="circleBang" />
                  <Text size={3}>
                    Better specs are available for{' '}
                    <a
                      href="/pricing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pro & Enterprise workspaces
                    </a>
                    .
                  </Text>
                </Stack>
              )}
              {!activeTeamInfo?.featureFlags.ubbBeta &&
                activeTeamInfo?.subscription.status && (
                  <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
                    <Icon name="circleBang" />
                    <Text size={3}>
                      Better specs are available for our new team plan, you can
                      upgrade{' '}
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
            </>
          )}
        </Stack>
      </Stack>

      <Stack css={{ justifyContent: 'flex-end' }}>
        <Stack gap={2}>
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
              disabled={!canCreate}
              variant="primary"
              autoWidth
            >
              Create {label}
            </Button>
          ) : (
            <Button autoWidth onClick={() => signInClicked()} type="button">
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
