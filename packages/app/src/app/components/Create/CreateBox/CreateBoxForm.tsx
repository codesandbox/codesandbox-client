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
import { PATHED_SANDBOXES_FOLDER_QUERY } from 'app/pages/Dashboard/queries';
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
  const { activeTeamInfo, activeTeam, hasLogIn } = useAppState();
  const { signInClicked } = useActions();
  const [name, setName] = useState<string>();
  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);

  const minimumPrivacy = Math.max(
    initialPrivacy ?? 2,
    activeTeamInfo?.settings.minimumPrivacy ?? 0
  ) as PrivacyLevel;

  const [permission, setPermission] = useState<PrivacyLevel>(minimumPrivacy);

  useEffect(() => {
    effects.api.getSandboxTitle().then(({ title }) => {
      if (nameInputRef.current) {
        setName(title);
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    });
  }, []);

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

        // Devboxes have been removed, so we always create a browser Sandbox.
        onSubmit({
          sandboxId: template.browserSandboxId ?? template.id,
          name,
          createAs: 'sandbox',
          permission,
          editor: 'csb',
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
      </Stack>

      <Stack>
        <Stack gap={2} css={{ alignItems: 'center', width: '100%' }}>
          <Stack css={{ flex: 1 }} />

          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            autoWidth
          >
            Cancel
          </Button>
          {hasLogIn ? (
            <Button type="submit" variant="primary" autoWidth loading={loading}>
              Create Sandbox
            </Button>
          ) : (
            <Button
              autoWidth
              onClick={() => signInClicked()}
              type="button"
              loading={loading}
            >
              Sign in to create Sandbox
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
