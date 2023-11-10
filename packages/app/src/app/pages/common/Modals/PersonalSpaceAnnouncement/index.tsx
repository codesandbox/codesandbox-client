import {
  Badge,
  Element,
  Stack,
  Text,
  Icon,
  IconButton,
} from '@codesandbox/components';
import React from 'react';
import { useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const PersonalSpaceAnnouncement: React.FC = () => {
  const { modalClosed } = useActions();

  return (
    <Alert>
      <Stack gap={8} direction="vertical">
        <Stack align="center" justify="space-between">
          <Badge variant="pro">New</Badge>
          <Text block size={6}>
            Do more with your primary workspace
          </Text>
          <IconButton
            onClick={modalClosed}
            variant="square"
            title="Close window"
            name="cross"
          />
        </Stack>
        <Text block size={3} variant="muted">
          Your personal workspaces been updated to a standard workspace allowing
          you to do more with the same space.
        </Text>

        <Element
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
            paddingTop: '16px',
            paddingBottom: '16px',
          }}
        >
          <Stack direction="vertical" align="center" gap={6}>
            <Icon name="addMember" size={64} />
            <Text size={4}>Add collaborators</Text>
            <Text size={3} variant="muted">
              You can now add members to this workspace through your settings.
              Enjoy the benefit of collaboration without the hassle of
              generating a new workspace.
            </Text>
          </Stack>
          <Stack direction="vertical" align="center" gap={6}>
            <Icon name="edit" size={64} />
            <Text size={4}>Customization</Text>
            <Text size={3} variant="muted">
              Does the current name not reflect the work you are doing? Simply
              open your profile and change the name and avatar to your liking.
            </Text>
          </Stack>
          <Stack direction="vertical" align="center" gap={6}>
            <Icon name="proBadge" size={64} />
            <Text size={4}>Upgrade to Pro</Text>
            <Text size={3} variant="muted">
              Easily upgrade this workspace to enjoy all the benefits of Pro.
            </Text>
          </Stack>
        </Element>
      </Stack>
    </Alert>
  );
};
