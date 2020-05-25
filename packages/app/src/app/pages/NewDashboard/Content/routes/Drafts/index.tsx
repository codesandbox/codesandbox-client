import { Column, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { SkeletonCard } from 'app/pages/NewDashboard/Components/Sandbox/SandboxCard';
import { SandboxGrid } from 'app/pages/NewDashboard/Components/SandboxGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import React, { useEffect } from 'react';

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
    <SelectionProvider sandboxes={visibleSandboxes}>
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
    </SelectionProvider>
  );
};
