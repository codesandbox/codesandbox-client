import React from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  VariableGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';

export const Drafts = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, getFilteredSandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.DRAFTS);
  }, [actions.dashboard]);

  return (
    <SelectionProvider sandboxes={sandboxes.DRAFTS}>
      <Helmet>
        <title>Drafts - CodeSandbox</title>
      </Helmet>
      <Header
        path="Drafts"
        templates={getPossibleTemplates(sandboxes.DRAFTS)}
        showViewOptions
        showFilters
        showSortOptions
      />
      {sandboxes.DRAFTS ? (
        <VariableGrid
          items={getFilteredSandboxes(
            sandboxes.DRAFTS.map(sandbox => ({
              type: 'sandbox',
              ...sandbox,
            }))
          )}
        />
      ) : (
        <SkeletonGrid count={8} marginTop={8} />
      )}
    </SelectionProvider>
  );
};
