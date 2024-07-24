import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';

export const Drafts = () => {
  const {
    activeTeam,
    user,
    dashboard: { sandboxes, getFilteredSandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.DRAFTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const items: DashboardGridItem[] = sandboxes.DRAFTS
    ? getFilteredSandboxes(sandboxes.DRAFTS)
        .filter(s => s.authorId === user?.id)
        .map(sandbox => ({
          type: 'sandbox',
          sandbox,
        }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'drafts';
  const isEmpty = items.length === 0;

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>My drafts - CodeSandbox</title>
      </Helmet>

      <Header
        title="Drafts"
        activeTeam={activeTeam}
        showViewOptions={!isEmpty}
        showSortOptions={!isEmpty}
      />

      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
