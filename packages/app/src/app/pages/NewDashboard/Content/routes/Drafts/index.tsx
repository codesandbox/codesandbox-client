import React, { useEffect, useState } from 'react';
import { Element, Column, Grid } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { getPossibleTemplates } from '../../utils';
import { SandboxCard } from '../../../Components/SandboxCard';

const SCROLLING_ELEMENT = document.getElementById('root');
const NUMBER_OF_SANDBOXES = 30;

export const Drafts = () => {
  const {
    actions,
    state: {
      dashboard: { draftSandboxes, getFilteredSandboxes, orderBy },
    },
  } = useOvermind();
  const filtered = draftSandboxes ? getFilteredSandboxes(draftSandboxes) : null;
  const [visibleSandboxes, setVisibleSandboxes] = useState([]);

  useEffect(() => {
    actions.dashboard.getDrafts();
  }, [actions.dashboard]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (
        SCROLLING_ELEMENT.getBoundingClientRect().bottom - 400 <=
          window.innerHeight &&
        draftSandboxes
      ) {
        setVisibleSandboxes(sandboxes =>
          sandboxes.concat(
            filtered.slice(
              sandboxes.length,
              sandboxes.length + NUMBER_OF_SANDBOXES
            )
          )
        );
      }
    });
  });

  useEffect(() => {
    if (filtered) {
      setVisibleSandboxes(filtered.slice(0, visibleSandboxes.length));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy]);

  useEffect(() => {
    if (draftSandboxes) {
      setVisibleSandboxes(filtered.slice(0, NUMBER_OF_SANDBOXES));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftSandboxes]);

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Header path="Drafts" templates={getPossibleTemplates(filtered || [])} />
      {draftSandboxes ? (
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
          })}
        >
          {visibleSandboxes.map(sandbox => (
            <Column key={sandbox.id}>
              <SandboxCard sandbox={sandbox} />
            </Column>
          ))}
        </Grid>
      ) : (
        <Loading />
      )}
    </Element>
  );
};
