import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { Helmet } from 'react-helmet';
import {
  DashboardGridItem,
  DashboardTemplate,
} from 'app/pages/NewDashboard/types';

export const Home = () => {
  const {
    actions,
    state: {
      dashboard: { viewMode, sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.HOME);
  }, [actions.dashboard]);

  const templates = (sandboxes.TEMPLATE_HOME || []).map(template => {
    const { sandbox, ...templateValues } = template;

    const dashboardTemplate: DashboardTemplate = {
      type: 'template' as 'template',
      sandbox,
      template: templateValues,
      isHomeTemplate: true,
    };

    return dashboardTemplate;
  });

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
          title: 'Your Recent Sandboxes',
          showMoreLink: '/new-dashboard/recent',
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
        { type: 'header', title: 'Your Recent Sandboxes' },
        { type: 'skeleton-row' },
      ];

  return (
    <SelectionProvider items={items}>
      <Helmet>
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      <Header title="Home" showViewOptions />
      <VariableGrid items={items} />
    </SelectionProvider>
  );
};
