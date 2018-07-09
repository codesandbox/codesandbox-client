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
import { Items, CategoryHeader } from './elements';
import { TEAMS_QUERY } from '../queries';

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
      <div style={{ width: 275, overflowY: 'auto' }}>
        <div style={{ margin: '0 1rem', marginBottom: '1.5rem' }}>
          <Input
            onFocus={this.handleSearchFocus}
            block
            value={store.dashboard.filters.search}
            onChange={this.handleSearchChange}
            placeholder="Filter Sandboxes"
          />
        </div>

        <Items style={{ marginBottom: '1rem' }}>
          <Item Icon={TimeIcon} path="/dashboard/recent" name="Recent" />
          <SandboxesItem />
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
      </div>
    );
  }
}

export default inject('signals', 'store')(observer(Sidebar));
