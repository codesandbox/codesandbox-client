import React, { useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Stack, Text, Input, Button, Link } from '@codesandbox/components';
import css from '@styled-system/css';

export const TeamInfo: React.FC<{ onTeamCreation: () => void }> = ({
  onTeamCreation,
}) => {
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
        onTeamCreation();
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
    <Stack
      css={css({
        alignItems: 'center',
      })}
      direction="vertical"
      gap={5}
    >
      <Stack
        css={css({
          alignItems: 'center',
        })}
        direction="vertical"
        gap={2}
      >
        <Text
          as="h2"
          css={css({
            fontFamily: 'Everett, sans-serif',
            margin: '0',
          })}
          size={8}
        >
          Create team
        </Text>
        <Text
          as="p"
          css={css({
            color: '#999999',
            margin: '0',
          })}
        >
          Teams are the best way of collaborating in CodeSandbox.
        </Text>
      </Stack>
      <Stack as="form" onSubmit={onSubmit} direction="vertical" gap={6}>
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

        <Button
          autoWidth
          loading={loading}
          disabled={loading || error}
          type="submit"
        >
          Create Team
        </Button>
        <Link
          css={css({
            color: '#999999',
          })}
          to="#"
          target="_blank"
        >
          <Text size={2}>More about teams and workspaces</Text>
        </Link>
      </Stack>
    </Stack>
  );
};
