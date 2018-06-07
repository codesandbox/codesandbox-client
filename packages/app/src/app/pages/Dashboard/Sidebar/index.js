import React from 'react';
import Input from 'common/components/Input';

import TimeIcon from 'react-icons/lib/md/access-time';
import TrashIcon from 'react-icons/lib/md/delete';

import Item from './Item';
import SandboxesItem from './SandboxesItem';
import { Items, CategoryHeader } from './elements';

export default class Sidebar extends React.Component {
  shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
  }

  render() {
    return (
      <div style={{ width: 275, overflowY: 'auto' }}>
        <div style={{ margin: '0 1rem' }}>
          <Input block placeholder="Filter Sandboxes" />
        </div>

        <Items>
          <CategoryHeader>My Sandboxes</CategoryHeader>
          <Item Icon={TimeIcon} path="/dashboard/recents" name="Recent" />
          <SandboxesItem />
          <Item Icon={TrashIcon} path="/dashboard/deleted" name="Trash" />
        </Items>
      </div>
    );
  }
}
