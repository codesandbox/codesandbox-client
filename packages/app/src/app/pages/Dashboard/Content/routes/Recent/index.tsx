import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Helmet } from 'react-helmet';
import {
  DashboardGridItem,
  DashboardTemplate,
  PageTypes,
} from 'app/pages/Dashboard/types';

export const Recent = () => {
  const {
    activeTeam,
    dashboard: { viewMode, sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  useEffect(() => {
    getPage(sandboxesTypes.RECENT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const templates: DashboardGridItem[] = (sandboxes.TEMPLATE_HOME || []).map(
    (template, i) => {
      const { sandbox, ...templateValues } = template;

      const dashboardTemplate: DashboardTemplate = {
        type: 'template' as 'template',
        sandbox,
        template: templateValues,
        autoFork: true,
        noDrag: true,
        optional: i >= 3,
      };

      return dashboardTemplate;
    }
  );

  // Make sure that a new row starts for the next item
  templates.push({ type: 'blank-row-fill' });

  const items: DashboardGridItem[] = sandboxes.RECENT
    ? [
        {
          type: 'header',
          title: 'Recently Used Templates',
          ...(viewMode === 'list'
            ? {
                showMoreLink: '/s',
                showMoreLabel: '+ New Sandbox',
              }
            : {}),
        },
        { type: 'new-sandbox' },
        ...templates,
        {
          type: 'header',
          title: 'Recently Viewed Sandboxes',
        },
        ...(sandboxes.RECENT || []).map(sandbox => ({
          type: 'sandbox' as 'sandbox',
          sandbox,
        })),
      ]
    : [
        { type: 'header', title: 'Recently Used Templates' },
        { type: 'skeleton-row' },
        { type: 'header', title: 'Recently Viewed Sandboxes' },
        { type: 'skeleton-row' },
      ];

  const pageType: PageTypes = 'recent';
  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      <Header title="Recent" activeTeam={activeTeam} showViewOptions />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
