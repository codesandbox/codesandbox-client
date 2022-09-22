import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { getPossibleTemplates } from '../../utils';

export const Shared = () => {
  const {
    activeTeam,
    dashboard: { sandboxes, getFilteredSandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.SHARED);
  }, [activeTeam, getPage]);

  const items: DashboardGridItem[] = sandboxes.SHARED
    ? getFilteredSandboxes(sandboxes.SHARED).map(sandbox => ({
        type: 'sandbox',
        sandbox,
      }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'shared';
  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Shared with Me - CodeSandbox</title>
      </Helmet>
      <Header
        title="Sandboxes shared with me"
        activeTeam={activeTeam}
        templates={getPossibleTemplates(sandboxes.SHARED)}
        showViewOptions
        showFilters
      />

      <VariableGrid items={items} page={pageType} />
    </SelectionProvider>
  );
};
