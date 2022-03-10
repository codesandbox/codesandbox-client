import React, { useState } from 'react';
import { useActions, useAppState } from 'app/overmind';
import {
  ThemeProvider,
  Element,
  Stack,
  Text,
  Input,
  Button,
} from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import css from '@styled-system/css';
import history from 'app/utils/history';

export const NewTeamModal: React.FC = () => {
  const { modals, dashboard } = useAppState();
  const {
    dashboard: { createTeam },
    modals: modalsActions,
  } = useActions();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const onSubmit = async event => {
    event.preventDefault();
    const teamName = event.target.name.value;

    if (teamName && teamName.trim()) {
      event.target.name.setCustomValidity('');
      setLoading(true);
      try {
        await createTeam({
          teamName,
          pilot: location.search.includes('pilot'),
        });
        setLoading(false);
        history.push(dashboardUrls.settings());

        modalsActions.createTeamModal.close();
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
    <ThemeProvider>
      <Modal
        isOpen={modals.createTeamModal.isCurrent}
        onClose={() => modalsActions.createTeamModal.close()}
        fullWidth={window.screen.availWidth < 800}
      >
        <Element
          css={css({
            backgroundColor: 'grays.800',
            border: '1px solid',
            borderColor: 'grays.600',
            borderRadius: 'medium',
            padding: 6,
          })}
        >
          <Stack direction="vertical" gap={7}>
            <Stack direction="vertical" gap={4}>
              <Text size={6} weight="bold">
                Create a team
              </Text>
              <Text size={3} variant="muted">
                Collaborate on code with friends or co-workers. Manage and work
                on sandboxes together.
              </Text>
            </Stack>

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
                <Button
                  variant="secondary"
                  autoWidth
                  onClick={modalsActions.createTeamModal.close}
                >
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
          </Stack>
        </Element>
      </Modal>
    </ThemeProvider>
  );
};
