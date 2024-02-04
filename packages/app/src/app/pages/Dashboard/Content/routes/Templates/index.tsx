import { useAppState, useActions } from 'app/overmind';
import { Helmet } from 'react-helmet';
import React, { useEffect } from 'react';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { TemplateFragmentDashboardFragment } from 'app/graphql/types';
import { Element } from '@codesandbox/components';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { getPossibleTemplates } from '../../utils';

export const Templates = () => {
  const {
    dashboard: { sandboxes, getFilteredSandboxes },
    activeTeam,
  } = useAppState();
  const { getPage } = useActions().dashboard;
  const { hasReachedSandboxLimit } = useWorkspaceLimits();

  useEffect(() => {
    getPage(sandboxesTypes.TEMPLATES);
  }, [getPage, activeTeam]);

  const possibleTemplates = sandboxes.TEMPLATES
    ? getPossibleTemplates(sandboxes.TEMPLATES)
    : [];

  const sandboxIdsToTemplate = new Map<
    string,
    TemplateFragmentDashboardFragment
  >();

  const templates = sandboxes.TEMPLATES || [];
  templates.forEach(template => {
    sandboxIdsToTemplate.set(template.sandbox.id, template);
  });
  const filteredTemplates = getFilteredSandboxes(
    templates.map(({ sandbox }) => sandbox)
  ).map(sandbox => sandboxIdsToTemplate.get(sandbox.id));

  const items: DashboardGridItem[] = sandboxes.TEMPLATES
    ? filteredTemplates.map(template => {
        const { sandbox, ...templateValues } = template;
        return {
          type: 'template' as 'template',
          sandbox,
          template: templateValues,
        };
      })
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'templates';
  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Templates - CodeSandbox</title>
      </Helmet>
      <Header
        title="Templates"
        activeTeam={activeTeam}
        templates={possibleTemplates}
        showViewOptions
        showFilters
        showSortOptions
      />
      {hasReachedSandboxLimit && (
        <Element css={{ padding: '0 26px 16px 16px' }}>
          <RestrictedSandboxes />
        </Element>
      )}
      <VariableGrid items={items} page={pageType} />
    </SelectionProvider>
  );
};
