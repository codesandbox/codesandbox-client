import React from 'react';
import css from '@styled-system/css';
import {
  Button,
  Element,
  Stack,
  Text,
  Input,
  Textarea,
  IconButton,
  Badge,
} from '@codesandbox/components';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useActions, useAppState } from 'app/overmind';

export const TeamInfo: React.FC = () => {
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState<{ name: string; url: string } | null>(
    null
  );

  const {
    activeTeamInfo: team,
    dashboard: { teams },
  } = useAppState();
  const actions = useActions();

  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isLegacyFreeTeam, isInactiveTeam } = useWorkspaceSubscription();

  const getFile = async avatar => {
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(avatar);
    });

    const stringUrl = url as string;

    setFile({
      name: avatar.name,
      url: stringUrl,
    });
  };

  const handleTeamNameChange = event => {
    const { value } = event.target;

    // Get the input and remove any whitespace from both ends.
    const trimmedName = value?.trim() ?? '';

    // Validate if the name input is filled with whitespaces.
    if (!trimmedName) {
      event.target.setCustomValidity('Team name is required.');
    } else if (teams.find(t => t.name === trimmedName)) {
      event.target.setCustomValidity(
        'Name already taken, please choose a new name.'
      );
    } else {
      event.target.setCustomValidity('');
    }
  };

  const onSubmit = async event => {
    event.preventDefault();

    const name = event.target.name.value?.trim();
    const description = event.target.description.value?.trim();

    if (!name) {
      return;
    }

    setLoading(true);
    // no try/catch because setTeamInfo dispatches
    // a notification toast on error.
    await actions.dashboard.setTeamInfo({
      name,
      description,
      file,
    });
    setEditing(false); // Return to the previous UI.
    setLoading(false); // Set loading to false.
  };

  if (editing) {
    return (
      <Stack as="form" onSubmit={onSubmit} direction="vertical" gap={2}>
        <Stack gap={4}>
          <Element css={css({ position: 'relative', height: 55 })}>
            <TeamAvatar
              style={{
                opacity: 0.6,
              }}
              name={team.name}
              avatar={file ? file.url : team.avatarUrl}
              size="bigger"
            />
            <label htmlFor="avatar" aria-label="Upload your avatar">
              <input
                css={css({
                  width: '0.1px',
                  height: '0.1px',
                  opacity: 0,
                  overflow: 'hidden',
                  position: 'absolute',
                  zIndex: -1,
                })}
                type="file"
                onChange={e => getFile(e.target.files[0])}
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
              />
              <Element
                css={css({
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  cursor: 'pointer',
                })}
              >
                <svg
                  width={18}
                  height={15}
                  fill="none"
                  viewBox="0 0 18 15"
                  css={css({
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  })}
                >
                  <path
                    fill="#fff"
                    fillRule="evenodd"
                    d="M13 2h3.286C17.233 2 18 2.768 18 3.714v9.572c0 .947-.767 1.714-1.714 1.714H1.714A1.714 1.714 0 010 13.286V3.714C0 2.768.768 2 1.714 2H5a4.992 4.992 0 014-2c1.636 0 3.088.786 4 2zm0 6a4 4 0 11-8 0 4 4 0 018 0zM8.8 6h.4v1.8H11v.4H9.2V10h-.4V8.2H7v-.4h1.8V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </Element>
            </label>
          </Element>
          <Stack direction="vertical" css={css({ width: '100%' })} gap={2}>
            <Input
              type="text"
              name="name"
              required
              defaultValue={team.name}
              placeholder="Enter team name"
              onChange={handleTeamNameChange}
            />
            <Textarea
              name="description"
              defaultValue={team.description}
              placeholder="Enter a description for your team"
            />
          </Stack>
        </Stack>
        <Stack justify="flex-end">
          <Button
            variant="link"
            css={{ width: 100 }}
            disabled={loading}
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            css={{ width: 100 }}
            disabled={loading}
            loading={loading}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={4}>
      <TeamAvatar name={team.name} avatar={team.avatarUrl} size="bigger" />
      <Stack direction="vertical" css={{ width: '100%' }} gap={1}>
        <Stack justify="space-between" align="center">
          <Text size={4} weight="500" css={{ wordBreak: 'break-all' }}>
            {team.name}
          </Text>
          {isTeamAdmin && (
            <IconButton
              variant="square"
              name="edit"
              size={12}
              title="Edit team"
              onClick={() => setEditing(true)}
            />
          )}
        </Stack>

        <Stack>
          {isLegacyFreeTeam && <Badge variant="trial">Free</Badge>}
          {isInactiveTeam && <Badge variant="neutral">Inactive</Badge>}
        </Stack>

        <Text size={3} css={{ marginTop: '8px' }} variant="muted">
          {team.description}
        </Text>
      </Stack>
    </Stack>
  );
};
