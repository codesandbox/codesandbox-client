import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { Grid, Element, Stack, Button } from '@codesandbox/components';
import { Box } from './components/Box';
import { Text } from './components/Typography';
import { randomColor } from '../../utils';
import { Header } from '../../../Components/Header';

export const TeamSettings = () => {
  const {
    state: {
      dashboard: { activeTeamInfo: team },
    },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getTeam();
  }, [actions.dashboard]);

  if (!team) {
    return <Header title="Team Settings" />;
  }
  const created = team.users.find(user => user.id === team.creatorId);
  return (
    <>
      <Header title="Team Settings" />
      <Grid
        columnGap={4}
        css={css({
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        })}
      >
        <Box>
          <Stack gap={4} align="flex-start">
            {team.avatarUrl ? (
              <img src={team.avatarUrl} width="55" alt={team.name} />
            ) : (
              <Stack
                align="center"
                justify="center"
                css={css({
                  minWidth: 55,
                  width: 55,
                  height: 55,
                  borderRadius: 'medium',
                  color: 'grays.800',
                  fontSize: 7,
                  background: randomColor,
                  fontWeight: 'bold',
                })}
              >
                {team.name.charAt(0)}
              </Stack>
            )}

            <Element>
              <Text weight="bold" block marginBottom={4} size={6}>
                {team.name}
              </Text>
              <Text>Community Plan (Free)</Text>
              <Text>{team.description}</Text>
            </Element>
          </Stack>
        </Box>
        <Box
          title={`${team.users.length} Team Member${
            team.users.length === 1 ? '' : 's'
          }`}
        >
          <Text>Created by {created.username}</Text>
        </Box>
        <Box white title="Team Pro">
          <Text white marginBottom={6}>
            Get early access and product updates?
          </Text>
          <Button
            href="https://airtable.com/shrlgLSJWiX8rYqyG"
            as="a"
            target="_blank"
          >
            Subscribe to Pro
          </Button>
        </Box>
      </Grid>
    </>
  );
};
