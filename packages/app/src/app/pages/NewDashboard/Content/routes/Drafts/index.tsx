import { Column, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import React, { useEffect } from 'react';

import { Header } from '../../../Components/Header';
import { Sandbox } from '../../../Components/Sandbox';
import { SkeletonCard } from '../../../Components/Sandbox/SandboxCard';
import { SandboxGrid } from '../../../Components/SandboxGrid';
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
      <Header />
      {sandboxes.DRAFTS ? (
        <SandboxGrid>
          {visibleSandboxes.map(sandbox => (
            <Sandbox key={sandbox.id} sandbox={sandbox} />
          ))}
        </SandboxGrid>
      ) : (
        <SandboxGrid>
          {Array.from(Array(8).keys()).map(n => (
            <Column key={n}>
              <SkeletonCard />
            </Column>
          ))}
        </SandboxGrid>
      )}
    </Element>
  );
};
