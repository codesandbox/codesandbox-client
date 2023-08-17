import React, { useState, useEffect } from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Stack, Text, Link, Element, Icon } from '@codesandbox/components';
import { InputText } from 'app/components/dashboard/InputText';
import { StyledButton } from 'app/components/dashboard/Button';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardURLs } from '@codesandbox/common/lib/utils/url-generator';
import { useCreateCheckout } from 'app/hooks';

export const TeamCreate: React.FC<{ onComplete: () => void }> = () => {
  const { dashboard } = useAppState();
  const actions = useActions();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingTeamError, setExistingTeamError] = useState(false);
  const [checkout, createCheckout] = useCreateCheckout();

  useEffect(() => {
    if (checkout.status === 'error') {
      setError(`Could not create stripe checkout link. ${checkout.error}`);
    }
  }, [checkout]);

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
        const newTeam = await actions.dashboard.createTeam({
          teamName,
        });

        await createCheckout({
          team_id: newTeam.id,
          success_path: dashboardURLs.recent(newTeam.id, {
            new_workspace: 'true',
          }),
          utm_source: 'pro_page',
        });
      } catch {
        setError('There was a problem creating your team');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInput = e => {
    const { value } = e.target;

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
      gap={6}
      css={{
        padding: '60px 0',
        maxWidth: '370px',
        width: '100%',
      }}
    >
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
          Name your workspace
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
          label="Workspace name"
          placeholder="My workspace"
          id="teamname"
          name="name"
          required
          autoFocus
          hideLabel
          onChange={handleInput}
        />

        {existingTeamError && (
          <Text size={2} variant="danger">
            Name already taken, please choose another one.
          </Text>
        )}

        {error && (
          <Text size={2} variant="danger">
            {error}
          </Text>
        )}

        <StyledButton
          loading={loading}
          disabled={loading || existingTeamError}
          type="submit"
        >
          Next
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
