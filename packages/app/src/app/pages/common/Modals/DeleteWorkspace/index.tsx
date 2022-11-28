import React, { FunctionComponent, useState } from 'react';
import { Input, Text, Button, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const DeleteWorkspace: FunctionComponent = () => {
  const { dashboard, modalClosed } = useActions();
  const { activeTeamInfo, user } = useAppState();
  const [teamName, setTeamName] = useState('');
  const otherUsers = (activeTeamInfo.users || []).filter(
    teamPerson => teamPerson.id !== user.id
  ).length;
  return (
    <Alert title="Delete team">
      <Text size={3} block variant="muted">
        Are you sure you want to delete this team? This action is{' '}
        <b>irreversible</b> and it will <b>delete all sandboxes</b> in this team
        {otherUsers ? (
          <>
            {' '}
            and will also <b>delete the team</b> for all other members. <br />
            <br />
            If this is not what you want you can instead{' '}
            <Button
              css={css({
                display: 'inline',
                padding: 0,
                width: 'auto',
                color: 'white',
                height: 'auto',
                fontWeight: 'bold',
              })}
              variant="link"
              onClick={async () => {
                await dashboard.leaveTeam();
                modalClosed();
              }}
            >
              Leave the Team.
            </Button>
          </>
        ) : (
          '.'
        )}
        <Text size={3} block marginBottom={4} marginTop={4} variant="muted">
          If you are sure please write the team name ({activeTeamInfo.name}) in
          the input below:
        </Text>
        <Input value={teamName} onChange={e => setTeamName(e.target.value)} />
        <Stack gap={2} marginTop={4} align="center" justify="flex-end">
          <Button autoWidth variant="secondary" onClick={modalClosed}>
            Cancel
          </Button>
          <Button
            autoWidth
            variant="danger"
            disabled={!teamName || teamName !== activeTeamInfo.name}
            onClick={dashboard.deleteWorkspace}
          >
            Delete team
          </Button>
        </Stack>
      </Text>
    </Alert>
  );
};
