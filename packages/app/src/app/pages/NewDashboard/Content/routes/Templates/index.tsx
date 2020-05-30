import { Column, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { SkeletonCard } from 'app/pages/NewDashboard/Components/Sandbox/SandboxCard';
import { SandboxGrid } from 'app/pages/NewDashboard/Components/SandboxGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import React, { useEffect } from 'react';

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
        <Header />
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
