import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  VariableGrid,
  GUTTER,
  GRID_MAX_WIDTH,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Helmet } from 'react-helmet';
import {
  DashboardGridItem,
  DashboardTemplate,
  PageTypes,
} from 'app/pages/Dashboard/types';
import styled from 'styled-components';

const BannerProjects = styled.a`
  display: block;

  width: calc(100% - ${2 * GUTTER}px);
  max-width: ${GRID_MAX_WIDTH - 2 * GUTTER}px;
  margin: 0 auto ${GUTTER}px;

  img {
    width: 100%;
  }
`;

export const Home = () => {
  const {
    activeTeam,
    dashboard: { viewMode, sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  useEffect(() => {
    getPage(sandboxesTypes.HOME);
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
          title: 'Recently Viewed Sandboxes',
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
        { type: 'header', title: 'Recently Viewed Sandboxes' },
        { type: 'skeleton-row' },
      ];

  const pageType: PageTypes = 'home';
  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      <BannerProjects href="https://codesandbox.io/p/dashboard?from=banner">
        <img
          src="/static/img/projects-banner.png"
          alt="The CodeSandbox flow, for any project of any size. Try now"
        />
      </BannerProjects>
      <Header title="Home" activeTeam={activeTeam} showViewOptions />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
