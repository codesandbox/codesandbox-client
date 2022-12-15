import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { getPossibleTemplates } from '../../utils';
import { EmptyLikes } from './EmptyLikes';

export const Liked = () => {
  const {
    activeTeam,
    dashboard: { sandboxes, getFilteredSandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.LIKED);
  }, [activeTeam, getPage]);

  const items: DashboardGridItem[] = sandboxes.LIKED
    ? getFilteredSandboxes(sandboxes.LIKED).map(sandbox => ({
        type: 'sandbox',
        sandbox,
      }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'liked';
  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Likes - CodeSandbox</title>
      </Helmet>
      <Header
        title="Liked sandboxes"
        activeTeam={activeTeam}
        templates={getPossibleTemplates(sandboxes.LIKED)}
        showViewOptions
        showFilters
      />

      {items.length > 0 ? (
        <VariableGrid items={items} page={pageType} />
      ) : (
        <EmptyLikes />
      )}
    </SelectionProvider>
  );
};
