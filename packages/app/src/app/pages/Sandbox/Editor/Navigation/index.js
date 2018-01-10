import React from 'react';
import { inject, observer } from 'mobx-react';
import workspaceItems from 'app/store/modules/workspace/items';

import GitHubIcon from 'react-icons/lib/go/mark-github';
import SettingsIcon from 'react-icons/lib/md/settings';

import InfoIcon from './InfoIcon';
import FilesIcon from './FileIcon';
import RocketIcon from './RocketIcon';

import { Container, IconContainer } from './elements';

const IDS_TO_ICONS = {
  project: InfoIcon,
  files: FilesIcon,
  github: GitHubIcon,
  deploy: RocketIcon,
  config: SettingsIcon,
};

const Navigation = ({ store, signals }) => (
  <Container>
    {workspaceItems.filter(w => !w.show || w.show(store)).map(item => {
      const { id } = item;
      const Icon = IDS_TO_ICONS[id];
      return (
        <IconContainer
          key={id}
          selected={id === store.workspace.openedWorkspaceItem}
          onClick={() => {
            signals.workspace.setWorkspaceItem({ item: id });
          }}
        >
          <Icon />
        </IconContainer>
      );
    })}
  </Container>
);

export default inject('signals', 'store')(observer(Navigation));
