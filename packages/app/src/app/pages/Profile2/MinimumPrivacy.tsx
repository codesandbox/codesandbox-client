import React from 'react';
import { useOvermind } from 'app/overmind';
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

export const MinimumPrivacy: React.FC<{ closeModal?: () => void }> = ({
  closeModal,
}) => {
  const {
    state: {
      dashboard: { teams },
      personalWorkspaceId,
    },
    actions: {
      dashboard: { setTeamMinimumPrivacy },
      profile: { fetchSandboxes },
    },
  } = useOvermind();

  const personalWorkspace = teams.find(team => team.id === personalWorkspaceId);
  const [minimumPrivacy, setMinimumPrivacy] = React.useState(
    personalWorkspace.settings.minimumPrivacy
  );

  const [updateDrafts, setUpdateDrafts] = React.useState(true);

  return (
    <Stack
      direction="vertical"
      justify="space-between"
      gap={114}
      css={css({ backgroundColor: 'grays.800', paddingY: 8, paddingX: 6 })}
    >
      <Stack direction="vertical" gap={8}>
        <Stack direction="vertical" gap={8}>
          <Text size={4} weight="bold">
            Change Default Privacy
          </Text>
          <Stack direction="vertical" gap={3}>
            <Select
              icon={privacyOptions[minimumPrivacy].icon}
              value={minimumPrivacy}
              onChange={({ target: { value } }) =>
                setMinimumPrivacy(parseInt(value, 10))
              }
            >
              <option value={0}>Public</option>
              <option value={1}>Unlisted</option>
              <option value={2}>Private</option>
            </Select>
            <Text variant="muted" size={2}>
              {privacyOptions[minimumPrivacy].description}
            </Text>
          </Stack>
          <Stack justify="space-between" as="label">
            <Text size={3}>
              Apply this privacy to all my Drafts - old and new
            </Text>
            <Switch
              on={updateDrafts}
              onChange={() => setUpdateDrafts(!updateDrafts)}
            />
          </Stack>
        </Stack>
      </Stack>
      <Stack justify="flex-end" gap={4}>
        <Button variant="link" autoWidth onClick={closeModal}>
          Cancel
        </Button>
        <Button
          autoWidth
          onClick={async () => {
            await setTeamMinimumPrivacy({
              teamId: personalWorkspaceId,
              minimumPrivacy,
              updateDrafts,
              source: 'Profiles',
            });
            closeModal();
            fetchSandboxes();
          }}
        >
          Change Privacy
        </Button>
      </Stack>
    </Stack>
  );
};
