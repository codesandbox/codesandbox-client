import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { ArticleCard } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
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
        <title>Shared with me - CodeSandbox</title>
      </Helmet>
      <Header
        title="Sandboxes shared with me"
        activeTeam={activeTeam}
        templates={getPossibleTemplates(sandboxes.SHARED)}
        showViewOptions
        showFilters
      />

      {items.length > 0 ? (
        <VariableGrid items={items} page={pageType} />
      ) : (
        <EmptyPage.StyledWrapper>
          <EmptyPage.StyledDescription as="p">
            There are currently no sandboxes shared with you.
          </EmptyPage.StyledDescription>
          <EmptyPage.StyledGrid>
            <ArticleCard
              title="Get feedback in context"
              thumbnail="/static/img/thumbnails/shared.png"
              url="https://codesandbox.io/team"
              onClick={() =>
                track('Shared sandboxes - open docs from empty state')
              }
            />
          </EmptyPage.StyledGrid>
        </EmptyPage.StyledWrapper>
      )}
    </SelectionProvider>
  );
};
