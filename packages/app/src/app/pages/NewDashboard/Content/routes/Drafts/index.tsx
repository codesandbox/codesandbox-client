import React, { useEffect } from 'react';
import { Element, Grid } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import css from '@styled-system/css';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { getPossibleTemplates } from '../../utils';
import { Sandbox } from '../../../Components/Sandbox';
import { useBottomScroll } from './useBottomScroll';

export const Drafts = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes },
    },
  } = useOvermind();
  const [visibleSandboxes] = useBottomScroll('DRAFTS');

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.DRAFTS);
  }, [actions.dashboard]);

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Header
        path="Drafts"
        templates={getPossibleTemplates(sandboxes.DRAFTS || [])}
      />
      {sandboxes.DRAFTS ? (
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
          })}
        >
          {visibleSandboxes.map(sandbox => (
            <Sandbox key={sandbox.id} sandbox={sandbox} />
          ))}
        </Grid>
      ) : (
        <Loading />
      )}
    </Element>
  );
};
