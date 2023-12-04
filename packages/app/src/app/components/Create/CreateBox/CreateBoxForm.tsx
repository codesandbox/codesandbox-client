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

import { useEffects } from 'app/overmind';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { CreateParams } from '../utils/types';

interface CreateBoxFormProps {
  type: 'sandbox' | 'devbox';
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
}

export const CreateBoxForm: React.FC<CreateBoxFormProps> = ({
  type,
  onCancel,
  onSubmit,
}) => {
  const label = type === 'sandbox' ? 'Sandbox' : 'Devbox';

  const [name, setName] = useState<string>();
  const effects = useEffects();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { isPro } = useWorkspaceSubscription();

  // TODO: default privacy in workspace
  const [permission, setPermission] = useState<0 | 1 | 2>(0);
  const [editor, setEditor] = useState<'web' | 'vscode'>('web');
  const showVMSpecs = type === 'devbox';
  const disableEditorChange = type === 'sandbox';

  // TODO: specs from subscription
  const defaultSpecs = isPro
    ? '4 vCPUs - 8GiB RAM - 16GB disk'
    : '2 vCPUs - 4GiB RAM - 4GB disk';

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
    <Stack
      direction="vertical"
      gap={7}
      css={{ width: '100%', height: '100%', paddingBottom: '24px' }}
    >
      <Element
        as="form"
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
        }}
        onSubmit={e => {
          e.preventDefault();
          onSubmit({
            name,
            createAs: type,
            permission,
            editor,
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
              <Select
                icon={PRIVACY_OPTIONS[permission].icon}
                defaultValue={permission}
                onChange={({ target: { value } }) => setPermission(value)}
              >
                <option value={0}>Public</option>
                <option value={1}>Unlisted</option>
                <option value={2}>Private</option>
              </Select>
            </Stack>
          </Stack>

          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Open in
            </Text>
            <Select
              icon={EDITOR_OPTIONS[editor].icon}
              defaultValue={editor}
              onChange={({ target: { value } }) => setEditor(value)}
            >
              <option value="web">CodeSandbox web editor</option>
              <option value="vscode">
                VSCode desktop (Using the CodeSandbox extension)
              </option>
            </Select>
            {disableEditorChange && (
              <Stack gap={1}>
                <Icon color="#999" name="circleBang" />
                <Text size={3} variant="muted">
                  Sandboxes can only be open in the web editor.
                </Text>
              </Stack>
            )}
          </Stack>

          {showVMSpecs && (
            <Stack direction="vertical" align="flex-start" gap={2}>
              <Text size={3} as="label">
                Virtual machine specifications
              </Text>
              <Input value={defaultSpecs} disabled />
              <Stack gap={1}>
                <Icon color="#999" name="circleBang" />
                <Text size={3} variant="muted">
                  VM specs are currently tied to your subscription.
                </Text>
              </Stack>
            </Stack>
          )}
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
    </Stack>
  );
};

const PRIVACY_OPTIONS = {
  0: {
    description: 'All your devboxes and sandboxes are public by default.',
    icon: () => <Icon size={12} name="globe" />,
  },
  1: {
    description:
      'Only people that get the link are able to see your devboxes and sandboxes.',
    icon: () => <Icon size={12} name="link" />,
  },
  2: {
    description: 'Only people with access can see your devboxes and sandboxes.',
    icon: () => <Icon size={12} name="lock" />,
  },
};

const EDITOR_OPTIONS = {
  web: {
    description: '',
    icon: () => <Icon size={12} name="boxDevbox" />,
  },
  vscode: {
    description: '',
    icon: () => <Icon size={12} name="boxSandbox" />,
  },
};
