import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Helmet } from 'react-helmet';
import {
  DashboardGridItem,
  DashboardTemplate,
  PageTypes,
} from 'app/pages/NewDashboard/types';

export const Home = () => {
  const {
    actions,
    state: {
      activeTeam,
      dashboard: { viewMode, sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.HOME);
  }, [actions.dashboard, activeTeam]);

  const templates: DashboardGridItem[] = (sandboxes.TEMPLATE_HOME || []).map(
    template => {
      const { sandbox, ...templateValues } = template;

      const dashboardTemplate: DashboardTemplate = {
        type: 'template' as 'template',
        sandbox,
        template: templateValues,
        autoFork: true,
        noDrag: true,
      };

      return dashboardTemplate;
    }
  );

  // Make sure that a new row starts for the next item
  templates.push({ type: 'blank-row-fill' });

  const items: DashboardGridItem[] = sandboxes.RECENT_HOME
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
          title: 'Recently Accessed Sandboxes',
          showMoreLink: dashboardUrls.recents(activeTeam),
          showMoreLabel: 'Show more',
        },
        ...(sandboxes.RECENT_HOME || []).map(sandbox => ({
          type: 'sandbox' as 'sandbox',
          sandbox,
        })),
      ]
    : [
        { type: 'header', title: 'Recently Used Templates' },
        { type: 'skeleton-row' },
        { type: 'header', title: 'Recently Accessed Sandboxes' },
        { type: 'skeleton-row' },
      ];

  const pageType: PageTypes = 'home';
  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      <Header title="Home" activeTeam={activeTeam} showViewOptions />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
