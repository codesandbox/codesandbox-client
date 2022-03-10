import React, { useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Stack, Text, Input, Button } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import history from 'app/utils/history';
import { Alert } from '../Common/Alert';

export const NewTeamModal: React.FC = () => {
  const { dashboard } = useAppState();
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value;

    if (teamName && teamName.trim()) {
      event.target.name.setCustomValidity('');
      setLoading(true);
      try {
        await actions.dashboard.createTeam({
          teamName,
          pilot: location.search.includes('pilot'),
        });
        setLoading(false);
        history.push(dashboardUrls.settings());

        actions.modalClosed();
      } catch {
        setLoading(false);
      }
    }
  };

  const handleInput = e => {
    const { value } = e.target;
    setName(value.trim());

    if (value && value.trim()) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity('Team name is required.');
    }
  };

  const error = Boolean(dashboard.teams.find(team => team.name === name));

  return (
    <Alert
      title="Create a team"
      description="Collaborate on code with friends or co-workers. Manage and work on sandboxes together."
    >
      <Stack as="form" onSubmit={onSubmit} direction="vertical" gap={2}>
        <Input
          name="name"
          type="text"
          placeholder="Team name"
          autoFocus
          required
          onChange={handleInput}
          css={css({ height: 8 })}
        />

        {error && (
          <Text size={2} variant="danger">
            Name already taken, please choose a new name.
          </Text>
        )}

        <Stack gap={2} marginTop={4} align="center" justify="flex-end">
          <Button variant="secondary" autoWidth onClick={actions.modalClosed}>
            Cancel
          </Button>

          <Button
            autoWidth
            loading={loading}
            disabled={loading || error}
            type="submit"
          >
            Create Team
          </Button>
        </Stack>
      </Stack>
    </Alert>
  );
};
