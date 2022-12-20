import React, { useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import css from '@styled-system/css';
import { Stack, Text, Link, Element, Icon } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { StyledButton } from 'app/components/dashboard/Button';
import track from '@codesandbox/common/lib/utils/analytics';

export const TeamInfo: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const { dashboard } = useAppState();
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value;

    if (teamName && teamName.trim()) {
      track('New Team - Create Team', {
        codesandbox: 'V1',
        event_source: 'UI',
      });

      event.target.name.setCustomValidity('');
      setLoading(true);
      try {
        await actions.dashboard.createTeam({
          teamName,
        });
        setLoading(false);
        onComplete();
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
      align="center"
      direction="vertical"
      gap={6}
      css={{
        padding: '60px 0',
        maxWidth: '370px',
        width: '100%',
      }}
    >
      <Element
        css={{ backgroundColor: '#252525', borderRadius: '4px' }}
        padding={6}
      >
        <Icon
          name="camera"
          size={16}
          css={{ color: '#C2C2C2', display: 'block' }}
        />
      </Element>
      <Stack align="center" direction="vertical" gap={2}>
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
        <Text
          as="p"
          size={13}
          css={css({
            color: '#999999',
            margin: '0',
            lineHeight: '16px',
          })}
        >
          Teams are the best way of collaborating in CodeSandbox.
        </Text>
      </Stack>
      <Stack
        as="form"
        onSubmit={onSubmit}
        direction="vertical"
        gap={6}
        css={{ width: '100%' }}
      >
        <InputText
          label="Team name"
          id="teamname"
          name="name"
          required
          autoFocus
          onChange={handleInput}
          value={name}
        />

        {error && (
          <Text size={2} variant="danger">
            Name already taken, please choose a new name.
          </Text>
        )}

        <StyledButton
          loading={loading}
          disabled={loading || error}
          type="submit"
        >
          Create Team
        </StyledButton>
      </Stack>
      <Element paddingTop={10}>
        <Link
          href="https://codesandbox.io/docs/learn/introduction/workspace"
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            track('New Team - Learn More', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
        >
          <Stack
            css={{
              color: '#999999',
            }}
            gap={3}
            justify="center"
          >
            <Text size={2}>More about teams and workspaces</Text>
            <Icon name="external" size={16} />
          </Stack>
        </Link>
      </Element>
    </Stack>
  );
};
