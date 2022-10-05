import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Notification } from 'app/pages/Dashboard/Components/Notification/Notification';

export const MyContributionsPage = () => {
  const params = useParams<{ path: string }>();
  const param = params.path || '';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { contributions },
  } = useAppState();

  React.useEffect(() => {
    actions.dashboard.getContributionBranches();
  }, [actions.dashboard]);

  const pageType: PageTypes = 'my-contributions';

  const getItemsToShow = (): DashboardGridItem[] => {
    if (contributions === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    return contributions.map(branch => ({
      type: 'branch',
      branch,
    }));
  };

  const itemsToShow = getItemsToShow();

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow}
    >
      <Helmet>
        <title>{param || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        title="My contributions"
        path={param}
        showViewOptions
        showBetaBadge
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
      />
      <Notification pageType={pageType}>
        {itemsToShow.length === 0
          ? 'Introducing contribution branches: the easiest way of contributing to open source.'
          : 'Your contribution branches now live here, so you can manage your contributions easily.'}
      </Notification>
      <VariableGrid page={pageType} items={itemsToShow} />
    </SelectionProvider>
  );
};

export const MyContributions = React.memo(MyContributionsPage);
