import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
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

  const items = sandboxes.DELETED
    ? [
        ...getSection(
          'Archived this week',
          getFilteredSandboxes(deletedSandboxesByTime.week)
        ),
        ...getSection(
          'Archived earlier',
          getFilteredSandboxes(deletedSandboxesByTime.older)
        ),
      ]
    : [
        { type: 'header', title: 'Archived this week' },
        { type: 'skeletonRow' },
        { type: 'header', title: 'Archived earlier' },
        { type: 'skeletonRow' },
      ];

  return (
    <SelectionProvider items={items}>
      <Helmet>
        <title>Deleted Sandboxes - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently Deleted"
        showFilters
        showSortOptions
        templates={getPossibleTemplates(sandboxes.DELETED)}
      />
      <VariableGrid items={items} />
    </SelectionProvider>
  );
};
