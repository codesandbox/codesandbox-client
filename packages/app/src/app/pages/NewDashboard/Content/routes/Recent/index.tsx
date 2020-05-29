import React from 'react';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { useOvermind } from 'app/overmind';
import { Stack, Text } from '@codesandbox/components';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';
import { getPossibleTemplates } from '../../utils';

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
      <Header
        title="Recently Modified Sandboxes"
        templates={getPossibleTemplates(sandboxes.RECENT)}
      />
      <section style={{ position: 'relative' }}>
        {sandboxes.RECENT ? (
          <>
            <SandboxGrid items={items} />
          </>
        ) : (
          <Stack as="section" direction="vertical" gap={8}>
            <SkeletonGroup title="Today" time="day" />
            <SkeletonGroup title="Last 7 Days" time="week" />
            <SkeletonGroup title="Earlier this month" time="month" />
            <SkeletonGroup title="Older" time="older" />
          </Stack>
        )}
      </section>
    </SelectionProvider>
  );
};

const SkeletonGroup = ({ title, time }) => (
  <>
    <Text marginBottom={6} block>
      {title}
    </Text>
    <SkeletonGrid count={4} />
  </>
);
