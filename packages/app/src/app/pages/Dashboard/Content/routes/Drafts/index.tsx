import React from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { getPossibleTemplates } from '../../utils';

export const Drafts = () => {
  const {
    actions,
    state: {
      activeTeam,
      user,
      dashboard: { sandboxes, getFilteredSandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.DRAFTS);
  }, [actions.dashboard, activeTeam]);

  const items: DashboardGridItem[] = sandboxes.DRAFTS
    ? getFilteredSandboxes(sandboxes.DRAFTS)
        .filter(s => s.authorId === user?.id)
        .map(sandbox => ({
          type: 'sandbox',
          sandbox,
        }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'drafts';
  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Drafts - CodeSandbox</title>
      </Helmet>
      <Header
        title="Drafts"
        activeTeam={activeTeam}
        templates={getPossibleTemplates(sandboxes.DRAFTS)}
        showViewOptions
        showFilters
        showSortOptions
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
