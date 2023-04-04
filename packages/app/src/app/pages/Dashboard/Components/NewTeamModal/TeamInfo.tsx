import React, { useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Stack, Text, Button } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import track from '@codesandbox/common/lib/utils/analytics';

export const TeamInfo: React.FC<{
  onComplete: () => void;
  onClose: () => void;
}> = ({ onComplete, onClose }) => {
  const { dashboard } = useAppState();
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTeamName, setTeamName] = useState<boolean>(false);
  const [existingTeamError, setExistingTeamError] = useState(false);

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value?.trim();

    if (teamName) {
      track('New Team - Create Team', {
        codesandbox: 'V1',
        event_source: 'UI',
      });

      setError(null);
      setLoading(true);
      try {
        await actions.dashboard.createTeam({
          teamName,
        });
        onComplete();
      } catch {
        setError('There was a problem creating your team');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInput = e => {
    const { value } = e.target;

    // Determine if input is filled.
    setTeamName(value);

    // Get the input and remove any whitespace from both ends.
    const trimmedName = value?.trim() ?? '';

    // Validate if the name input is filled with whitespaces.
    if (trimmedName) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity('Team name is required.');
    }

    // Check if there's any team with the same name.
    setExistingTeamError(
      Boolean(dashboard.teams.find(team => team.name === trimmedName))
    );
  };

  return (
    <Stack
      align="center"
      direction="vertical"
      gap={10}
      css={{ width: '400px' }}
    >
      <Text
        as="h2"
        size={32}
        weight="500"
        align="center"
        css={{
          margin: 0,
          color: '#ffffff',
          fontFamily: 'Everett, sans-serif',
          lineHeight: '42px',
          letterSpacing: '-0.01em',
        }}
      >
        Create team
      </Text>
      <Stack
        as="form"
        onSubmit={onSubmit}
        direction="vertical"
        gap={10}
        css={{ width: '100%' }}
      >
        <Stack direction="vertical" gap={2}>
          <InputText
            label="Team name"
            id="teamname"
            name="name"
            required
            autoFocus
            onChange={handleInput}
            isFullWidth
          />

          {existingTeamError && (
            <Text size={2} variant="danger">
              Name already taken, please choose a new name.
            </Text>
          )}

          {error && (
            <Text size={2} variant="danger">
              {error}
            </Text>
          )}
        </Stack>

        <Stack
          direction="vertical"
          gap={6}
          css={{ width: '200px', alignSelf: 'center' }}
        >
          <Button
            loading={loading}
            disabled={!hasTeamName || loading || existingTeamError}
            type="submit"
          >
            Continue
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
