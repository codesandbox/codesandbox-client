import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Element, Grid, Column, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { Filters } from 'app/pages/NewDashboard/Components/Filters';
import { getPossibleTemplates } from '../../utils';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Recent = () => {
  const {
    actions,
    state: {
      user,
      dashboard: {
        recentSandboxesByTime,
        recentSandboxes,
        getFilteredSandboxes,
      },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getRecentSandboxes();
  }, [actions.dashboard, user]);

  const possibleTemplates = recentSandboxes
    ? getPossibleTemplates(recentSandboxes)
    : [];

  const Group = ({ title, time }) =>
    getFilteredSandboxes(recentSandboxesByTime[time]).length ? (
      <Element marginBottom={14}>
        <Text marginBottom={6} block>
          {title}
        </Text>
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          })}
        >
          {getFilteredSandboxes(recentSandboxesByTime[time]).map(sandbox => (
            <Column key={sandbox.id}>
              <SandboxCard sandbox={sandbox} />
            </Column>
          ))}
        </Grid>
      </Element>
    ) : null;

  return (
    <>
      <section style={{ position: 'relative' }}>
        <Stack>
          <Text marginBottom={4} block>
            Recently Modified Sandboxes
          </Text>
          <Filters possibleTemplates={possibleTemplates} />
        </Stack>
        {recentSandboxes ? (
          <>
            <Group title="Today" time="day" />
            <Group title="Last 7 Days" time="week" />
            <Group title="Earlier this month" time="month" />
            <Group title="Older" time="older" />
          </>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};
