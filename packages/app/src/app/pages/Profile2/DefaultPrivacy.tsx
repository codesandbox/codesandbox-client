import React from 'react';
// import { useOvermind } from 'app/overmind';
import {
  Stack,
  Text,
  Select,
  Switch,
  Button,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';

const privacyOptions = {
  0: {
    description: 'All your sandboxes are public by default.',
    icon: () => <Icon size={10} name="globe" />,
  },
  1: {
    description: 'Only people with a private link are able to see a Sandbox.',
    icon: () => <Icon size={10} name="link" />,
  },
  2: {
    description: 'Only people you share a Sandbox with, can see it.',
    icon: () => <Icon size={10} name="lock" />,
  },
};

export const DefaultPrivacy: React.FC<{ closeModal?: () => void }> = ({
  closeModal,
}) => {
  // const {
  //   state: { currentModalMessage },
  // } = useOvermind();

  const [defaultPrivacy, setDefaultPrivacy] = React.useState(0);

  return (
    <Stack
      direction="vertical"
      justify="space-between"
      gap={114}
      css={css({ backgroundColor: 'grays.800', padding: 8 })}
    >
      <Stack direction="vertical" gap={8}>
        <Stack direction="vertical" gap={8}>
          <Text size={4} weight="bold">
            Change Default Privacy
          </Text>
          <Stack direction="vertical" gap={3}>
            <Select
              icon={privacyOptions[defaultPrivacy].icon}
              value={defaultPrivacy}
              onChange={({ target: { value } }) => setDefaultPrivacy(value)}
            >
              <option value={0}>Public</option>
              <option value={1}>Unlisted</option>
              <option value={2}>Private</option>
            </Select>
            <Text variant="muted" size={2}>
              {privacyOptions[defaultPrivacy].description}
            </Text>
          </Stack>
          <Stack justify="space-between">
            <Text size={3}>
              Apply this privacy to all my Drafts - old and new
            </Text>
            <Switch defaultOn />
          </Stack>
        </Stack>
      </Stack>
      <Stack justify="flex-end" gap={4}>
        <Button variant="link" autoWidth onClick={closeModal}>
          Cancel
        </Button>
        <Button
          autoWidth
          onClick={() => {
            closeModal();
          }}
        >
          Change Privacy
        </Button>
      </Stack>
    </Stack>
  );
};
