import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Grid } from '@codesandbox/components';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import css from '@styled-system/css';
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

  const possibleTemplates = sandboxes.SEARCH
    ? getPossibleTemplates(sandboxes.SEARCH)
    : [];

  const query = location.search.split('query=')[1];
  const length = (sandboxes.SEARCH || []).length;
  const title = `${length} ${
    length === 1 ? 'result' : 'results'
  } for "${query}"`;

  return (
    <>
      <Header title={title} templates={possibleTemplates} />
      <section style={{ position: 'relative' }}>
        {sandboxes.SEARCH ? (
          <Grid
            rowGap={6}
            columnGap={6}
            marginBottom={8}
            css={css({
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
            })}
          >
            {sandboxes.SEARCH.map(sandbox => (
              <Sandbox key={sandbox.id} template sandbox={sandbox} />
            ))}
          </Grid>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};

export const Search = withRouter(SearchComponent);
