import React, { useState } from 'react';
import {
  Stack,
  Element,
  Button,
  Text,
  Input,
  Radio,
  Icon,
} from '@codesandbox/components';

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
  // TODO: default privacy in workspace
  const [permission, setPermission] = useState<0 | 1 | 2>(0);
  const [editor, setEditor] = useState<'web' | 'vscode'>('web');
  const showVMSpecs = type === 'devbox';
  const disableEditorChange = type === 'sandbox';

  const defaultSpecs = '4 vCPUs - 8GiB RAM - 16GB disk';

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
            <Text size={3} id="name-desc" variant="muted">
              Leaving this field empty will generate a random name.
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
            />
          </Stack>

          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Visibility
            </Text>
            <Stack direction="vertical" gap={1}>
              <Radio
                checked={permission === 0}
                onChange={() => setPermission(0)}
                label="Public"
              />
              <Radio
                checked={permission === 1}
                onChange={() => setPermission(1)}
                label="Unlisted"
              />
              <Radio
                checked={permission === 2}
                onChange={() => setPermission(2)}
                label="Private"
              />
            </Stack>
          </Stack>

          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Open in
            </Text>
            <Stack direction="vertical" gap={1}>
              <Radio
                disabled={disableEditorChange}
                checked={editor === 'web'}
                onChange={() => setEditor('web')}
                label="Web editor"
              />
              <Radio
                disabled={disableEditorChange}
                checked={editor === 'vscode'}
                onChange={() => setEditor('vscode')}
                label="VSCode"
              />
            </Stack>
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
