import { Button } from '@codesandbox/common/es/components/Button';
import Input from '@codesandbox/common/es/components/Input';
import { teamOverviewUrl } from '@codesandbox/common/es/utils/url-generator';
import { useOvermind } from 'app/overmind';
import history from 'app/utils/history';
import React from 'react';
import { Query } from 'react-apollo';
import { MdPeople } from 'react-icons/md';
import { Route, withRouter } from 'react-router-dom';
import DashboardIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/dashboard.svg';

import { TEAMS_QUERY } from '../queries';
import { CategoryHeader, InputWrapper, Items, SidebarStyled } from './elements';
import { Item } from './Item';
import { SandboxesItem } from './SandboxesItem';
import { TemplateItem } from './TemplateItem';
import { TrashItem } from './TrashItem';

const SidebarComponent = () => {
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
              <Items style={{ marginBottom: '1rem' }}>
                <Item
                  Icon={DashboardIcon}
                  path="/dashboard/recent"
                  name="Overview"
                />

                <SandboxesItem
                  selectedSandboxes={dashboardState.selectedSandboxes}
                  currentPath={path}
                  currentTeamId={currentTeamId}
                  openByDefault
                />

                <TemplateItem currentPath={path} />

                <TrashItem currentPath={path} />
              </Items>

              <Query query={TEAMS_QUERY}>
                {({ loading, data, error }: any) => {
                  if (loading || error || !data.me || !(data && data.me)) {
                    return null;
                  }

                  const { teams = [] } = data.me;

                  return teams.map(({ id, name }) => (
                    <div key={id}>
                      <Items>
                        <CategoryHeader>{name}</CategoryHeader>
                        <Item
                          Icon={MdPeople}
                          path={teamOverviewUrl(id)}
                          name="Team Overview"
                        />

                        <SandboxesItem
                          selectedSandboxes={dashboardState.selectedSandboxes}
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
export const Sidebar = withRouter(SidebarComponent);
