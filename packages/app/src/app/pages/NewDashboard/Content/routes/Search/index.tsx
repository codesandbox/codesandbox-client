import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';

export const SearchComponent = ({ location }) => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, orderBy, filters },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.SEARCH);
  }, [actions.dashboard, location.search, filters, orderBy]);

  const query = location.search.split('query=')[1];
  const length = (sandboxes.SEARCH || []).length;
  const title = `${length} ${
    length === 1 ? 'result' : 'results'
  } for "${query}"`;

  return (
    <SelectionProvider sandoxes={sandboxes.SEARCH}>
      <Header
        title={title}
        templates={getPossibleTemplates(sandboxes.SEARCH)}
      />
      <section style={{ position: 'relative' }}>
        {sandboxes.SEARCH ? (
          <SandboxGrid
            items={
              sandboxes.SEARCH &&
              sandboxes.SEARCH.map(sandbox => ({
                type: 'sandbox',
                ...sandbox,
              }))
            }
          />
        ) : (
          <SkeletonGrid count={4} />
        )}
      </section>
    </SelectionProvider>
  );
};

export const Search = withRouter(SearchComponent);
