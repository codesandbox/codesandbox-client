import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Helmet } from 'react-helmet';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';
import { getPossibleTemplates } from '../../utils';

export const SearchComponent = ({ location }) => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, getFilteredSandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.SEARCH);
  }, [actions.dashboard, location.search]);

  const items: DashboardGridItem[] = sandboxes.SEARCH
    ? getFilteredSandboxes(sandboxes.SEARCH).map(sandbox => ({
        type: 'sandbox',
        sandbox,
      }))
    : [{ type: 'skeleton-row' }];

  return (
    <SelectionProvider items={items}>
      <Helmet>
        <title>
          {location.search
            ? `Search: '${location.search.split('?query=')[1]}' - CodeSandbox`
            : 'Search - CodeSandbox'}
        </title>
      </Helmet>
      <Header
        title="Search results"
        showViewOptions
        showFilters
        showSortOptions
        templates={getPossibleTemplates(sandboxes.SEARCH)}
      />

      <section style={{ position: 'relative' }}>
        <VariableGrid items={items} />
      </section>
    </SelectionProvider>
  );
};

export const Search = withRouter(SearchComponent);
