import React from 'react';
import history from 'app/utils/history';
import { inject, observer } from 'mobx-react';
import { Query } from 'react-apollo';
import Input from 'common/components/Input';
import Button from 'app/components/Button';
import TimeIcon from 'react-icons/lib/md/access-time';
import PeopleIcon from 'react-icons/lib/md/people';

import { teamOverviewUrl } from 'common/utils/url-generator';

import Item from './Item';
import SandboxesItem from './SandboxesItem';
import TrashItem from './TrashItem';
import { Items, CategoryHeader, SidebarStyled, InputWrapper } from './elements';
import { TEAMS_QUERY, PATHED_SANDBOXES_FOLDER_QUERY } from '../queries';

class Sidebar extends React.Component {
  shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
  }

  handleSearchFocus = () => {
    history.push('/dashboard/search');
  };

  handleSearchChange = e => {
    this.props.signals.dashboard.searchChanged({ search: e.target.value });
  };

  render() {
    const { store } = this.props;

    return (
      <SidebarStyled>
        <InputWrapper>
          <Input
            onFocus={this.handleSearchFocus}
            block
            value={store.dashboard.filters.search}
            onChange={this.handleSearchChange}
            placeholder="Search Sandboxes"
          />
        </InputWrapper>

        <Items style={{ marginBottom: '1rem' }}>
          <Item Icon={TimeIcon} path="/dashboard/recent" name="Recent" />
          <Query
            variables={{ teamId: undefined }}
            query={PATHED_SANDBOXES_FOLDER_QUERY}
          >
            {({ data }) => {
              // We open this by default if there are no folders yet, to let the user know
              // that they can create folders.
              const openByDefault =
                data && data.me && data.me.collections.length === 1;
              return <SandboxesItem openByDefault={openByDefault} />;
            }}
          </Query>
          <TrashItem />
        </Items>

        <Query query={TEAMS_QUERY}>
          {({ loading, data, error }) => {
            if (loading) {
              return null;
            }

            if (error) {
              return null;
            }

            const teams = data.me.teams;

            return teams.map(team => (
              <div key={team.id}>
                <Items>
                  <CategoryHeader>{team.name}</CategoryHeader>
                  <Item
                    Icon={PeopleIcon}
                    path={teamOverviewUrl(team.id)}
                    name="Team Overview"
                  />
                  <SandboxesItem teamId={team.id} />
                </Items>
              </div>
            ));
          }}
        </Query>

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
  }
}

export default inject('signals', 'store')(observer(Sidebar));
