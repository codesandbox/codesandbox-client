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
      dashboard: { draftSandboxes, getFilteredSandboxes },
    },
  } = useOvermind();
  const [visibleSandboxes, setVisibleSandboxes] = useState([]);

  useEffect(() => {
    actions.dashboard.getDrafts();
  }, [actions.dashboard]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (
        SCROLLING_ELEMENT.getBoundingClientRect().bottom - 200 <=
          window.innerHeight &&
        draftSandboxes
      ) {
        setVisibleSandboxes(sandboxes =>
          sandboxes.concat(
            draftSandboxes.slice(
              sandboxes.length,
              sandboxes.length + NUMBER_OF_SANDBOXES
            )
          )
        );
      }
    });
  });

  useEffect(() => {
    if (draftSandboxes) {
      setVisibleSandboxes(draftSandboxes.slice(0, NUMBER_OF_SANDBOXES));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftSandboxes]);

  const possibleTemplates = draftSandboxes
    ? getPossibleTemplates(draftSandboxes)
    : [];

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Header path="Drafts" templates={possibleTemplates} />
      {draftSandboxes ? (
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
          })}
        >
          {getFilteredSandboxes(visibleSandboxes).map(sandbox => (
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
