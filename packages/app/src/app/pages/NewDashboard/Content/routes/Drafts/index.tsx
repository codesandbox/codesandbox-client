import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Element, Column } from '@codesandbox/components';

import { getPossibleTemplates } from '../../utils';
import { Header } from '../../../Components/Header';

import { SandboxGrid } from '../../../Components/SandboxGrid';
import { Sandbox } from '../../../Components/Sandbox';
import { SkeletonCard } from '../../../Components/Sandbox/SandboxCard';
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
        templates={getPossibleTemplates(sandboxes.DRAFTS)}
      />
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
