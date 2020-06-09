import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  VariableGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';

export const Templates = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes, getFilteredSandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.TEMPLATES);
  }, [actions.dashboard]);

  const items =
    sandboxes.TEMPLATES &&
    getFilteredSandboxes(
      // @ts-ignore
      sandboxes.TEMPLATES.map(template => {
        const { sandbox, ...templateValues } = template;
        return {
          ...sandbox,
          type: 'sandbox',
          isTemplate: true,
          template: templateValues,
        };
      })
    );

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
      <Header
        title="Templates"
        templates={[]}
        showViewOptions
        showFilters
        showSortOptions
      />
      {sandboxes.TEMPLATES ? (
        <VariableGrid items={items} />
      ) : (
        <SkeletonGrid count={8} />
      )}
    </SelectionProvider>
  );
};
