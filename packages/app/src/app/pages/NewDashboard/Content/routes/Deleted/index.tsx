import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Stack, Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';

export const Deleted = () => {
  const {
    actions,
    state: {
      dashboard: { deletedSandboxesByTime, sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.DELETED);
  }, [actions.dashboard]);

  const getSection = (title, deletedSandboxes) => {
    if (!deletedSandboxes.length) return [];

    return [
      { type: 'header', title },
      ...deletedSandboxes.map(sandbox => ({
        type: 'sandbox',
        ...sandbox,
      })),
    ];
  };

  const items = [
    ...getSection('Archived this week', deletedSandboxesByTime.week),
    ...getSection('Archived earlier', deletedSandboxesByTime.older),
  ];

  return (
    <SelectionProvider sandboxes={sandboxes.DELETED}>
      <Header title="Recently Deleted" />
      {sandboxes.DELETED ? (
        <SandboxGrid items={items} />
      ) : (
        <Stack as="section" direction="vertical" gap={8}>
          <Element css={css({ height: 4 })} />
          <section>
            <Text marginLeft={4}>Recently Used Templates</Text>
            <SkeletonGrid count={4} />
          </section>
          <section>
            <Text marginLeft={4}>Your Recent Sandboxes</Text>
            <SkeletonGrid count={4} />
          </section>
        </Stack>
      )}
    </SelectionProvider>
  );
};
