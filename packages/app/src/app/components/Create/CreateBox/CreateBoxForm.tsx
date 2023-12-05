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

import { useAppState, useEffects } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGlobalPersistedState } from 'app/hooks/usePersistedState';
import { proUrl } from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';
import { CreateParams } from '../utils/types';

interface CreateBoxFormProps {
  type: 'sandbox' | 'devbox';
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
}

type PrivacyLevel = 0 | 1 | 2;

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  type,
  onCancel,
  onSubmit,
}) => {
  const label = type === 'sandbox' ? 'Sandbox' : 'Devbox';

  const { activeTeamInfo } = useAppState();
  const [name, setName] = useState<string>();
  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isPro } = useWorkspaceSubscription();
  const miniumPrivacy = isPro
    ? ((activeTeamInfo?.settings.minimumPrivacy || 0) as PrivacyLevel)
    : 0;

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
    type === 'sandbox' ? (
      'Sandboxes run in your browser.'
    ) : isPro ? (
      <>
        VM specs are currently tied to{' '}
        <Text
          as="a"
          css={{ textDecoration: 'none' }}
          variant="active"
          href={proUrl()}
        >
          your Pro subscription
        </Text>
        .
      </>
    ) : (
      <>
        Better specs are available for{' '}
        <Text
          as="a"
          css={{ textDecoration: 'none' }}
          variant="active"
          href={proUrl()}
        >
          Pro workspaces
        </Text>
        .
      </>
    );

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
        <Stack direction="vertical" gap={1}>
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
            Visibility
          </Text>
          <Stack direction="vertical" gap={1}>
            {isPro ? (
              <Select
                icon={PRIVACY_OPTIONS[permission].icon}
                defaultValue={permission}
                onChange={({ target: { value } }) => setPermission(value)}
              >
                <option value={0}>{PRIVACY_OPTIONS[0].description}</option>
                <option value={1}>{PRIVACY_OPTIONS[1].description}</option>
                <option value={2}>{PRIVACY_OPTIONS[2].description}</option>
              </Select>
            ) : (
              <>
                <Input
                  css={{ opacity: 0.7, cursor: 'not-allowed' }}
                  value="Public"
                  disabled
                />
                <Stack gap={1}>
                  <Icon color="#999" name="circleBang" />
                  <Text size={3} variant="muted">
                    You need a{' '}
                    <Text
                      as="a"
                      variant="active"
                      css={{ textDecoration: 'none' }}
                      href={proUrl()}
                    >
                      Pro workspace
                    </Text>{' '}
                    to change {type} visibility.
                  </Text>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>

        <Stack direction="vertical" gap={2}>
          <Text size={3} as="label">
            Open in
          </Text>
          {type === 'sandbox' ? (
            <>
              <Input
                css={{ opacity: 0.7, cursor: 'not-allowed' }}
                value="CodeSandbox web editor"
                disabled
              />
              <Stack gap={1}>
                <Icon color="#999" name="circleBang" />
                <Text size={3} variant="muted">
                  Sandboxes can only be opened in the web editor.{' '}
                  <Text
                    as="a"
                    css={{ textDecoration: 'none' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={docsUrl('/learn/sandboxes/editor-features')}
                    variant="active"
                  >
                    Learn more about sandboxes
                  </Text>
                  .
                </Text>
              </Stack>
            </>
          ) : (
            <Select
              icon={EDITOR_ICONS[editor]}
              defaultValue={editor}
              onChange={({ target: { value } }) => setEditor(value)}
            >
              <option value="csb">CodeSandbox web editor</option>
              <option value="vscode">
                VS Code desktop (Using the CodeSandbox extension)
              </option>
            </Select>
          )}
        </Stack>

        <Stack direction="vertical" align="flex-start" gap={2}>
          <Text size={3} as="label">
            Runtime
          </Text>
          <Input
            css={{ opacity: 0.7, cursor: 'not-allowed' }}
            value={defaultSpecs}
            disabled
          />
          <Stack gap={1}>
            <Icon color="#999" name="circleBang" />
            <Text size={3} variant="muted">
              {specsInfo}
            </Text>
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
          <Button type="submit" variant="primary" autoWidth>
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
