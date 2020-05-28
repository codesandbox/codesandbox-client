import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Element } from '@codesandbox/components';

import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';
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
        <Header
          path="Drafts"
          templates={getPossibleTemplates(sandboxes.DRAFTS)}
        />
        {sandboxes.DRAFTS ? (
          <SandboxGrid sandboxes={visibleSandboxes} />
        ) : (
          <SkeletonGrid count={8} />
        )}
      </Element>
    </SelectionProvider>
  );
};
