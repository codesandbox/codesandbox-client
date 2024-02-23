import React, { useEffect, useRef, useState } from 'react';
import {
  Stack,
  Element,
  Button,
  Text,
  Input,
  Icon,
  Select,
  Switch,
  Tooltip,
} from '@codesandbox/components';
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

import { useAppState, useEffects } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { PATHED_SANDBOXES_FOLDER_QUERY } from 'app/pages/Dashboard/queries';
import { Query } from 'react-apollo';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { Link } from 'react-router-dom';
import { VMTier } from 'app/overmind/effects/api/types';
import { useGithubAccounts } from 'app/hooks/useGithubOrganizations';
import { CreateBoxParams, CreateRepoParams } from '../utils/types';

interface CreateBoxFormProps {
  type: 'sandbox' | 'devbox';
  collectionId: string | undefined;
  setCollectionId: (collectionId: string | undefined) => void;
  onCancel: () => void;
  onCreateBox: (params: CreateBoxParams) => void;
  onCreateRepository: (params: CreateRepoParams) => void;
  onClose: () => void;
}

type PrivacyLevel = 0 | 1 | 2;

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  type,
  collectionId,
  setCollectionId,
  onCancel,
  onCreateBox,
  onCreateRepository,
  onClose,
}) => {
  const { activeTeamInfo, activeTeam } = useAppState();
  const {
    hasReachedSandboxLimit,
    hasReachedDraftLimit,
    highestAllowedVMTier,
  } = useWorkspaceLimits();
  const { isAdmin } = useWorkspaceAuthorization();
  const [name, setName] = useState<string>();
  const [createRepo, setCreateRepo] = useState<boolean>(false);
  const [privateRepo, setPrivateRepo] = useState<boolean>(true);
  const githubAccounts = useGithubAccounts();
  const userOrganization = githubAccounts?.data?.personal.login;

  // eslint-disable-next-line no-nested-ternary
  const label = createRepo
    ? 'Repository'
    : type === 'sandbox'
    ? 'Sandbox'
    : 'Devbox';

  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isFree } = useWorkspaceSubscription();
  const isDraft = collectionId === undefined;

  const canSetPrivacy = !isDraft;
  const canCreateDraft = !hasReachedDraftLimit;
  const canCreateInFolders = type === 'devbox' || !hasReachedSandboxLimit;
  const canCreate =
    (isDraft && canCreateDraft) || (!isDraft && canCreateInFolders);

  const miniumPrivacy = canSetPrivacy
    ? ((activeTeamInfo?.settings.minimumPrivacy || 0) as PrivacyLevel)
    : 2;

  const [permission, setPermission] = useState<PrivacyLevel>(miniumPrivacy);
  const [editor, setEditor] = useGlobalPersistedState<'csb' | 'vscode'>(
    'DEFAULT_EDITOR',
    'csb'
  );

  const defaultTier = isFree ? 1 : 2;
  const [selectedTier, setSelectedTier] = useState<number>(defaultTier);
  const [availableTiers, setAvailableTiers] = useState<VMTier[]>([]);

  useEffect(() => {
    effects.api.getSandboxTitle().then(({ title }) => {
      if (nameInputRef.current) {
        setName(title);
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    });
    if (type === 'devbox') {
      effects.api.getVMSpecs().then(res => {
        setAvailableTiers(
          res.vmTiers.filter(t => t.tier <= highestAllowedVMTier)
        );
      });
    }
  }, []);

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
        // Only pass customVMTier if user selects something else than the default
        const customVMTier =
          availableTiers.length > 0 && selectedTier !== defaultTier
            ? selectedTier
            : undefined;

        // ensure 'csb' is always passed when creating a sandbox
        const openInEditor = type === 'sandbox' ? 'csb' : editor;

        if (createRepo) {
          onCreateRepository({
            name,
            owner: userOrganization,
            isPrivate: privateRepo,
            customVMTier,
            editor: openInEditor,
          });
        } else {
          onCreateBox({
            name,
            createAs: type,
            permission,
            editor: openInEditor,
            customVMTier,
          });
        }
      }}
    >
      <Stack direction="vertical" gap={6}>
        <Stack justify="space-between">
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

          {/** If workspace is at any limit and user cannot create something new, don't allow repos as an escape hatch */}
          {canCreate && (
            <Tooltip label="Use this template to start a new repository on GitHub">
              <Stack
                as="label"
                align="center"
                gap={1}
                css={{ cursor: 'pointer' }}
              >
                <Text size={3}>Create repository</Text>
                <Switch
                  on={createRepo}
                  onChange={() => setCreateRepo(!createRepo)}
                />
              </Stack>
            </Tooltip>
          )}
        </Stack>
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
          {createRepo && (
            <InputExplanation variant="info">
              The repository will be created inside your personal account (
              {userOrganization}).
            </InputExplanation>
          )}
        </Stack>

        {!createRepo && (
          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Folder
            </Text>

            <Query
              variables={{ teamId: activeTeam }}
              query={PATHED_SANDBOXES_FOLDER_QUERY}
              fetchPolicy="network-only"
            >
              {({ data }) => {
                return (
                  <Select
                    icon={() => (
                      <Icon name={isDraft ? 'file' : 'folder'} size={12} />
                    )}
                    value={collectionId}
                    onChange={({ target: { value } }) =>
                      value === '$CSBDRAFTS'
                        ? setCollectionId(undefined)
                        : setCollectionId(value)
                    }
                  >
                    <option value="$CSBDRAFTS">Drafts</option>

                    {data?.me?.collections?.map(collection => (
                      <option value={collection.id}>
                        {collection.path === '/'
                          ? 'All Devboxes and Sandboxes'
                          : collection.path.slice(1).split('/').join(' / ')}
                      </option>
                    ))}
                  </Select>
                );
              }}
            </Query>

            {isDraft && canCreateDraft && (
              <InputExplanation variant="info">
                Drafts are private and only visible to you.
              </InputExplanation>
            )}

            {isDraft && !canCreateDraft && (
              <InputExplanation variant="error">
                Your{' '}
                <Link
                  css={{ color: 'inherit' }}
                  onClick={onClose}
                  to={dashboard.drafts(activeTeam)}
                >
                  Drafts folder
                </Link>{' '}
                is full. Delete unneeded drafts, or{' '}
                {isAdmin ? (
                  <>
                    <Link
                      css={{ color: 'inherit' }}
                      to={dashboard.upgradeUrl({
                        workspaceId: activeTeam,
                        source: 'create_draft_limit',
                      })}
                      onClick={onClose}
                    >
                      upgrade to Pro
                    </Link>{' '}
                    for unlimited drafts
                  </>
                ) : (
                  'ask an admin to upgrade to Pro for unlimited drafts'
                )}
                .
              </InputExplanation>
            )}

            {!isDraft && !canCreateInFolders && (
              <InputExplanation variant="error">
                You reached the maximum amount of shareable Sandboxes in this
                workspace.
              </InputExplanation>
            )}
          </Stack>
        )}

        {createRepo ? (
          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Privacy
            </Text>
            <Stack direction="vertical" gap={2}>
              <Select
                icon={() => (
                  <Icon size={12} name={privateRepo ? 'lock' : 'globe'} />
                )}
                defaultValue="private"
                onChange={e => {
                  setPrivateRepo(e.target.value === 'private');
                }}
              >
                <option value="private">
                  Private - You choose who can see and commit to this
                  repository.
                </option>
                <option value="public">
                  Public - Anyone on the internet can see this repository. You
                  choose who can commit.
                </option>
              </Select>
            </Stack>
          </Stack>
        ) : (
          !isDraft &&
          canCreate && (
            <Stack direction="vertical" gap={2}>
              <Text size={3} as="label">
                Privacy
              </Text>
              <Select
                icon={PRIVACY_OPTIONS[permission].icon}
                defaultValue={permission}
                onChange={({ target: { value } }) => setPermission(value)}
              >
                <option value={0}>{PRIVACY_OPTIONS[0].description}</option>
                <option value={1}>{PRIVACY_OPTIONS[1].description}</option>
                <option value={2}>{PRIVACY_OPTIONS[2].description}</option>
              </Select>
            </Stack>
          )
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
              <InputExplanation variant="info">
                Sandboxes can only be opened in the web editor.
              </InputExplanation>
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
              <InputExplanation variant="info">
                Sandboxes run in your browser.
              </InputExplanation>
            </>
          ) : (
            <>
              <Select
                value={selectedTier}
                disabled={availableTiers.length === 0}
                onChange={e => setSelectedTier(parseInt(e.target.value, 10))}
              >
                {availableTiers.map(t => (
                  <option key={t.shortid} value={t.tier}>
                    {t.name} ({t.cpu} vCPUs, {t.memory} GiB RAM, {t.storage} GB
                    Disk for {t.creditBasis} credits/hour)
                  </option>
                ))}
              </Select>
              {isFree && (
                <InputExplanation variant="info">
                  Better specs are available for Pro workspaces.
                </InputExplanation>
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
          <Button
            type="submit"
            disabled={!canCreate}
            variant="primary"
            autoWidth
          >
            Create {label}
          </Button>
        </Stack>
      </Stack>
    </Element>
  );
};

const PRIVACY_OPTIONS = {
  0: {
    description: 'Public (Everyone can view)',
    icon: () => <Icon size={12} name="globe" />,
  },
  1: {
    description: 'Unlisted (Everyone with the link can view)',
    icon: () => <Icon size={12} name="link" />,
  },
  2: {
    description: 'Private (Only workspace members have access)',
    icon: () => <Icon size={12} name="lock" />,
  },
};

const EDITOR_ICONS = {
  csb: () => <Icon size={12} name="cloud" />,
  vscode: () => <Icon size={12} name="vscode" />,
};

const InputExplanation: React.FC<{ variant: 'info' | 'error' }> = ({
  children,
  variant = 'info',
}) => {
  const COLOR_MAP = {
    info: '#A8BFFA',
    error: '#F5A8A8',
  };

  return (
    <Stack gap={1} css={{ color: COLOR_MAP[variant] }}>
      <Icon name="circleBang" />
      <Text size={3}>{children}</Text>
    </Stack>
  );
};
