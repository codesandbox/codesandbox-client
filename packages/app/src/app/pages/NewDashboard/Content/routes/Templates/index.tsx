import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';
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
      <Header title="Templates" templates={[]} />
      {sandboxes.TEMPLATES ? (
        <SandboxGrid
          items={
            sandboxes.TEMPLATES &&
            sandboxes.TEMPLATES.map(template => {
              const { sandbox, ...templateValues } = template;
              return {
                ...sandbox,
                type: 'sandbox',
                isTemplate: true,
                template: templateValues,
              };
            })
          }
        />
      ) : (
        <SkeletonGrid count={8} />
      )}
    </SelectionProvider>
  );
};
