import React from 'react';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { useOvermind } from 'app/overmind';
import { Stack, Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';

export const Recent = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, recentSandboxesByTime, getFilteredSandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.RECENT);
  }, [actions.dashboard]);

  const getSection = (title, time) => {
    const recentSandboxes = getFilteredSandboxes(recentSandboxesByTime[time]);

    if (!recentSandboxes.length) return [];

    return [
      { type: 'header', title },
      ...recentSandboxes.map(sandbox => ({
        type: 'sandbox',
        ...sandbox,
      })),
    ];
  };

  const items = [
    ...getSection('Today', 'day'),
    ...getSection('Last 7 days', 'week'),
    ...getSection('Earlier this month', 'month'),
    ...getSection('Older', 'older'),
  ];

  return (
    <SelectionProvider sandboxes={sandboxes.RECENT}>
      <Header />
      <section style={{ position: 'relative' }}>
        {sandboxes.RECENT ? (
          <>
            <SandboxGrid items={items} />
          </>
        ) : (
          <Stack as="section" direction="vertical" gap={8}>
            <Element css={css({ height: 4 })} />
            <SkeletonGroup title="Today" time="day" count={2} />
            <SkeletonGroup title="Last 7 Days" time="week" />
            <SkeletonGroup title="Earlier this month" time="month" />
            <SkeletonGroup title="Older" time="older" />
          </Stack>
        )}
      </section>
    </SelectionProvider>
  );
};

const SkeletonGroup = ({ title, time, count = 4 }) => (
  <>
    <Text marginLeft={4} marginBottom={6} block>
      {title}
    </Text>
    <SkeletonGrid count={count} />
  </>
);
