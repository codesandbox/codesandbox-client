import React from 'react';
import Input from 'common/components/Input';

import TimeIcon from 'react-icons/lib/md/access-time';
import TrashIcon from 'react-icons/lib/md/delete';
import InfoIcon from 'app/pages/Sandbox/Editor/Navigation/InfoIcon';
import DropboxIcon from 'react-icons/lib/fa/dropbox';

import Item from './Item';
import { Items } from './elements';

export default class Sidebar extends React.PureComponent {
  props: Props;

  render() {
    return (
      <div>
        <Input block placeholder="Filter Sandboxes" />

        <Items>
          <Item Icon={TimeIcon} name="Recent" />
          <Item Icon={InfoIcon} name="Sandboxes" />
          <Item Icon={DropboxIcon} name="Dropbox" />
          <Item Icon={TrashIcon} name="Deleted Sandboxes" />
        </Items>
      </div>
    );
  }
}
