import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import css from '@styled-system/css';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Element, Column } from '@codesandbox/components';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { SandboxGrid } from 'app/pages/NewDashboard/Components/SandboxGrid';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { SkeletonCard } from 'app/pages/NewDashboard/Components/Sandbox/SandboxCard';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';

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
    <SelectionProvider
      sandboxes={
        sandboxes.TEMPLATES &&
        sandboxes.TEMPLATES.map(template => {
          const { sandbox, ...templateValues } = template;
          return {
            ...sandbox,
            isTemplate: true,
            template: templateValues,
          };
        })
      }
    >
      <Element css={css({ position: 'relative' })}>
        <Header title="Templates" templates={[]} />
        {sandboxes.TEMPLATES ? (
          <SandboxGrid>
            {sandboxes.TEMPLATES.map(({ sandbox }) => (
              <Sandbox isTemplate sandbox={sandbox} key={sandbox.id} />
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
