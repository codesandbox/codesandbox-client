import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import { ArticleCard } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';

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
  const isEmpty = items.length === 0;

  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Shared with me - CodeSandbox</title>
      </Helmet>
      <Header
        title="Sandboxes shared with me"
        activeTeam={activeTeam}
        showViewOptions={!isEmpty}
      />

      {isEmpty ? (
        <EmptyPage.StyledWrapper>
          <EmptyPage.StyledDescription as="p">
            There are currently no sandboxes shared with you.
          </EmptyPage.StyledDescription>
          <EmptyPage.StyledGrid>
            <ArticleCard
              title="Get feedback in context"
              thumbnail="/static/img/thumbnails/page_shared.png"
              url={appendOnboardingTracking('https://codesandbox.io/team')}
              onClick={() =>
                track('Empty State Card - Content card', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                  card_type: 'landing-team-intro',
                })
              }
            />
          </EmptyPage.StyledGrid>
        </EmptyPage.StyledWrapper>
      ) : (
        <VariableGrid items={items} page={pageType} />
      )}
    </SelectionProvider>
  );
};
