import { Column, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import React, { useEffect } from 'react';

import { Header } from '../../../Components/Header';
import { Sandbox } from '../../../Components/Sandbox';
import { SkeletonCard } from '../../../Components/Sandbox/SandboxCard';
import { SandboxGrid } from '../../../Components/SandboxGrid';

export const Templates = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.TEMPLATES);
  }, [actions.dashboard]);

  return (
    <Element css={css({ position: 'relative' })}>
      <Header />
      {sandboxes.TEMPLATES ? (
        <SandboxGrid>
          {sandboxes.TEMPLATES.map(({ sandbox }) => (
            <Sandbox template sandbox={sandbox} key={sandbox.id} />
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
