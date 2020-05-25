import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { SandboxGrid } from 'app/pages/NewDashboard/Components/SandboxGrid';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

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

  return (
    <>
      <Header />
      <section style={{ position: 'relative' }}>
        {sandboxes.SEARCH ? (
          <SandboxGrid>
            {sandboxes.SEARCH.map(sandbox => (
              <Sandbox key={sandbox.id} template sandbox={sandbox} />
            ))}
          </SandboxGrid>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};

export const Search = withRouter(SearchComponent);
