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
import { dashboard } from '@codesandbox/common/lib/utils/url-generator';

import { useAppState, useEffects } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { PATHED_SANDBOXES_FOLDER_QUERY } from 'app/pages/Dashboard/queries';
import { Query } from 'react-apollo';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { Link } from 'react-router-dom';
import { CreateParams } from '../utils/types';

interface CreateBoxFormProps {
  type: 'sandbox' | 'devbox';
  collectionId: string | undefined;
  setCollectionId: (collectionId: string | undefined) => void;
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
  onClose: () => void;
}

type PrivacyLevel = 0 | 1 | 2;

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  type,
  collectionId,
  setCollectionId,
  onCancel,
  onSubmit,
  onClose,
}) => {
  const label = type === 'sandbox' ? 'Sandbox' : 'Devbox';

  const { activeTeamInfo, activeTeam } = useAppState();
  const { hasReachedSandboxLimit, hasReachedDraftLimit } = useWorkspaceLimits();
  const { isAdmin } = useWorkspaceAuthorization();
  const [name, setName] = useState<string>();
  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isPro } = useWorkspaceSubscription();
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

  const defaultSpecs =
    // eslint-disable-next-line no-nested-ternary
    type === 'sandbox'
      ? 'Browser'
      : isPro
      ? '4 vCPUs - 8GiB RAM - 12GB disk'
      : '2 vCPUs - 2GiB RAM - 6GB disk';

  const specsInfo =
    // eslint-disable-next-line no-nested-ternary
    type === 'sandbox'
      ? 'Sandboxes run in your browser.'
      : isPro
      ? 'VM specs are currently tied to your Pro subscription.'
      : 'Better specs are available for Pro workspaces';

  useEffect(() => {
    effects.api.getSandboxTitle().then(({ title }) => {
      if (nameInputRef.current) {
        setName(title);
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    });
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
        onSubmit({
          name,
          createAs: type,
          permission,
          editor: type === 'sandbox' ? 'csb' : editor, // ensure 'csb' is always passed when creating a sandbox
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
            Name
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
            <Stack gap={1} css={{ color: '#A8BFFA' }}>
              <Icon name="circleBang" />
              <Text size={3}>Drafts are private and only visible to you.</Text>
            </Stack>
          )}

          {isDraft && !canCreateDraft && (
            <Stack gap={1} css={{ color: '#F5A8A8' }}>
              <Icon name="circleBang" />
              <Text size={3}>
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
              </Text>
            </Stack>
          )}

          {!isDraft && !canCreateInFolders && (
            <Stack gap={1} css={{ color: '#F5A8A8' }}>
              <Icon name="circleBang" />
              <Text size={3}>
                You reached the maximum amount of shareable Sandboxes in this
                workspace.
              </Text>
            </Stack>
          )}
        </Stack>

        {!isDraft && canCreate && (
          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Visibility
            </Text>
            <Stack direction="vertical" gap={2}>
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
          <Input
            css={{ cursor: 'not-allowed' }}
            value={defaultSpecs}
            disabled
          />
          <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
            <Icon name="circleBang" />
            <Text size={3}>{specsInfo}</Text>
          </Stack>
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
