import React, { useState } from 'react';
import { Stack, Element, Button, Text, Input } from '@codesandbox/components';

import { CreateParams } from './utils/types';
import { StyledSelect } from './elements';

interface FromTemplateProps {
  type: 'sandbox' | 'devbox';
  onCancel: () => void;
  onSubmit: (params: CreateParams) => void;
}

export const FromTemplate: React.FC<FromTemplateProps> = ({
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
  const enableEditorChange = type === 'devbox';

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
            />
            <Element
              as="span"
              id="name-desc"
              css={{ color: '#999999', fontSize: '12px' }}
            >
              Leaving this field empty will generate a random name.
            </Element>
          </Stack>

          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Visibility
            </Text>
            <StyledSelect
              defaultValue={permission}
              onChange={e => setPermission(e.target.value)}
            >
              <option value={0}>Public</option>
              <option value={1}>Unlisted</option>
              <option value={2}>Private</option>
            </StyledSelect>
          </Stack>

          <Stack direction="vertical" gap={2}>
            <Text size={3} as="label">
              Open in
            </Text>
            <StyledSelect
              defaultValue={permission}
              disabled={enableEditorChange}
              onChange={e => setEditor(e.target.value)}
            >
              <option value="web">Web editor</option>
              <option value="vscode">VSCode</option>
            </StyledSelect>
          </Stack>

          {showVMSpecs && (
            <Stack direction="vertical" align="flex-start" gap={2}>
              <Text size={3} as="label">
                VM specs
              </Text>
              <Stack
                direction="vertical"
                gap={2}
                css={{
                  padding: '8px',
                  border: '1px solid #252525',
                  borderRadius: '4px',
                }}
              >
                <Text size={3} variant="muted">
                  4 vCPUs
                </Text>
                <Text size={3} variant="muted">
                  8GiB RAM
                </Text>
                <Text size={3} variant="muted">
                  12GB disk
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
