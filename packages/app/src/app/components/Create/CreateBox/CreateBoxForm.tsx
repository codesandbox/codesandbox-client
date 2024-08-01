import React, { useEffect, useRef, useState } from 'react';
import {
  Stack,
  Element,
  Button,
  Text,
  Input,
  Icon,
  Select,
  Radio,
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
  setCollectionId: (collectionId: string | undefined) => void;
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
  onClose: () => void;
}

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  template,
  initialPrivacy,
  collectionId,
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
  const { highestAllowedVMTier } = useWorkspaceLimits();
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
      <Stack direction="vertical" gap={6}>
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
                    setCollectionId(value);
                  }}
                >
                  <option key="drafts" value={null}>
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

          <Radio
            disabled={!runsInTheBrowser}
            checked={runtime === 'browser'}
            css={{ cursor: 'inherit' }}
            onChange={e => setRuntime(e.target.checked ? 'browser' : 'vm')}
            label="Browser (Sandbox)"
          />

          <Radio
            disabled={!runsOnVM}
            checked={runtime === 'vm'}
            label="Virtual Machine (Devbox)"
            onChange={e => setRuntime(e.target.checked ? 'vm' : 'browser')}
          />

          <Stack
            direction="vertical"
            css={{ paddingLeft: '24px', paddingTop: '4px', width: '100%' }}
            gap={1}
          >
            <Select
              value={selectedTier}
              disabled={runtime === 'browser'}
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

            <Stack gap={1} align="center" css={{ color: '#A8BFFA' }}>
              <Icon name="circleBang" />
              <Text size={3}>
                VMs use credits.{' '}
                <Text
                  as="a"
                  color="inherit"
                  href="/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </Text>
                .
              </Text>
            </Stack>

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
          </Stack>
        </Stack>

        <Stack direction="vertical" gap={2}>
          <Text size={3} as="label">
            Open in
          </Text>

          <Select
            icon={EDITOR_ICONS[editor]}
            defaultValue={editor}
            onChange={({ target: { value } }) => setEditor(value)}
            disabled={runtime === 'browser'}
          >
            <option value="csb">CodeSandbox Web Editor</option>
            <option value="vscode">
              VS Code Desktop (Using the CodeSandbox extension)
            </option>
          </Select>

          {runtime === 'browser' && (
            <Stack gap={1} css={{ color: '#A8BFFA' }}>
              <Icon name="circleBang" />
              <Text size={3}>
                Sandboxes can only be opened in the web editor.
              </Text>
            </Stack>
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
            <Button type="submit" variant="primary" autoWidth>
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
