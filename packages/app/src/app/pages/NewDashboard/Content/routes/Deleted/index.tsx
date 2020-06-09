import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Stack, Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  VariableGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';

export const Deleted = () => {
  const {
    actions,
    state: {
      dashboard: { deletedSandboxesByTime, getFilteredSandboxes, sandboxes },
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
    ...getSection(
      'Archived this week',
      getFilteredSandboxes(deletedSandboxesByTime.week)
    ),
    ...getSection(
      'Archived earlier',
      getFilteredSandboxes(deletedSandboxesByTime.older)
    ),
  ];

  return (
    <SelectionProvider sandboxes={sandboxes.DELETED}>
      <Helmet>
        <title>Deleted Sandboxes - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently Deleted"
        showFilters
        showSortOptions
        templates={getPossibleTemplates(sandboxes.DELETED)}
      />
      {sandboxes.DELETED ? (
        <VariableGrid items={items} />
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
