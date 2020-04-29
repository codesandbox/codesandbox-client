import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import css from '@styled-system/css';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Element, Column } from '@codesandbox/components';
import { Header } from '../../../Components/Header';
import { SandboxGrid } from '../../../Components/SandboxGrid';
import { Sandbox } from '../../../Components/Sandbox';
import { SkeletonCard } from '../../../Components/SandboxCard';

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
      <Header title="Templates" />
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
