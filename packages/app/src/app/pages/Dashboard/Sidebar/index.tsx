import React from 'react';
import history from 'app/utils/history';
import { useOvermind } from 'app/overmind';
import { Route } from 'react-router-dom';
import { Query } from 'react-apollo';
import Input from '@codesandbox/common/lib/components/Input';
import { Button } from '@codesandbox/common/lib/components/Button';
import PeopleIcon from 'react-icons/lib/md/people';

// @ts-ignore
import { teamOverviewUrl } from '@codesandbox/common/lib/utils/url-generator';
import DashboardIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

import { Item } from './Item';
import { SandboxesItem } from './SandboxesItem';
import { TrashItem } from './TrashItem';
import { Items, CategoryHeader, SidebarStyled, InputWrapper } from './elements';
import { TEAMS_QUERY } from '../queries';
import { TemplateItem } from './TemplateItem';

const Sidebar = () => {
  const {
    state: { dashboard: dashboardState },
    actions: { dashboard: dashboardAction },
  } = useOvermind();

  const handleSearchFocus = () => {
    history.push('/dashboard/search', { from: 'sandboxSearchFocused' });
  };

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    dashboardAction.searchChanged({ search: e.target.value });
  };

  return (
    <SidebarStyled>
      <InputWrapper>
        <Input
          onFocus={handleSearchFocus}
          block
          value={dashboardState.filters.search}
          onChange={handleSearchChange}
          placeholder="Search my sandboxes"
        />
      </InputWrapper>

      <Route
        path={[
          '/dashboard/sandboxes/:path*',
          '/dashboard/teams/:teamId/sandboxes/:path*',
          '/',
        ]}
      >
        {({ location, match }) => {
          const testRegex = /\/dashboard.*?sandboxes/;

          const path = location.pathname.replace(testRegex, '');
          const currentTeamId = match ? match.params.teamId : undefined;

          return (
            <>
              {({ store: innerStore }) => (
                <>
                  <Items style={{ marginBottom: '1rem' }}>
                    <Item
                      Icon={DashboardIcon}
                      path="/dashboard/recent"
                      name="Overview"
                    />

                    <SandboxesItem
                      selectedSandboxes={innerStore.dashboard.selectedSandboxes}
                      currentPath={path}
                      currentTeamId={currentTeamId}
                      openByDefault
                    />

                    <TemplateItem currentPath={path} />

                    <TrashItem currentPath={path} />
                  </Items>

                  <Query query={TEAMS_QUERY}>
                    {({ loading, data, error }) => {
                      if (loading) {
                        return null;
                      }

                      if (error || !data.me) {
                        return null;
                      }

                      if (!(data && data.me)) {
                        return null;
                      }

                      const { teams = [] } = data.me;

                      return teams.map(({ id, name }) => (
                        <div key={id}>
                          <Items>
                            <CategoryHeader>{name}</CategoryHeader>
                            <Item
                              Icon={PeopleIcon}
                              path={teamOverviewUrl(id)}
                              name="Team Overview"
                            />

                            <SandboxesItem
                              whatTheFuck
                              selectedSandboxes={
                                dashboardState.selectedSandboxes
                              }
                              currentPath={path}
                              currentTeamId={currentTeamId}
                              teamId={id}
                            />

                            <TemplateItem currentPath={path} teamId={id} />
                          </Items>
                        </div>
                      ));
                    }}
                  </Query>
                </>
              )}
            </>
          );
        }}
      </Route>

      <div style={{ margin: '2rem', fontSize: '.875rem' }}>
        <Button
          style={{ display: 'block' }}
          to="/dashboard/teams/new"
          small
          block
        >
          Create Team
        </Button>
      </div>
    </SidebarStyled>
  );
};

export default Sidebar;
