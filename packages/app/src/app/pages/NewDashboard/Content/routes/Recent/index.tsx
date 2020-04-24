import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Element, Grid, Column } from '@codesandbox/components';
import css from '@styled-system/css';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { Header } from 'app/pages/NewDashboard/Components/Header';
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
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
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
      <Header
        title="Recently Modified Sandboxes"
        templates={possibleTemplates}
      />
      <section style={{ position: 'relative' }}>
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
