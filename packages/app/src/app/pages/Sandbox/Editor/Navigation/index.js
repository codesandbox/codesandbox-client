import React from 'react';
import { inject, observer } from 'mobx-react';

import PlusIcon from 'react-icons/lib/go/plus';
import ServerIcon from 'react-icons/lib/go/server';

import getWorkspaceItems from 'app/store/modules/workspace/items';
import Tooltip from 'common/lib/components/Tooltip';

import InfoIcon from '-!svg-react-loader!common/lib/icons/sandbox.svg';
import GitHubIcon from '-!svg-react-loader!common/lib/icons/github.svg';
import LiveIcon from '-!svg-react-loader!common/lib/icons/live.svg';
import FilesIcon from '-!svg-react-loader!common/lib/icons/file.svg';
import RocketIcon from '-!svg-react-loader!common/lib/icons/rocket.svg';
import ConfigurationIcon from '-!svg-react-loader!common/lib/icons/cog.svg';

import { Container, IconContainer } from './elements';

const IDS_TO_ICONS = {
  project: InfoIcon,
  'project-summary': InfoIcon,
  files: FilesIcon,
  github: GitHubIcon,
  deploy: RocketIcon,
  config: ConfigurationIcon,
  live: LiveIcon,
  more: PlusIcon,
  server: ServerIcon,
};

const Navigation = ({ store, signals, topOffset, bottomOffset }) => (
  <Container topOffset={topOffset} bottomOffset={bottomOffset}>
    {getWorkspaceItems(store)
      .filter(w => !w.show || w.show(store))
      .map(item => {
        const { id, name } = item;
        const Icon = IDS_TO_ICONS[id];
        const selected =
          !store.workspace.workspaceHidden &&
          id === store.workspace.openedWorkspaceItem;
        return (
          <Tooltip key={id} position="right" title={name}>
            <IconContainer
              selected={selected}
              onClick={() => {
                if (selected) {
                  signals.workspace.setWorkspaceHidden({ hidden: true });
                } else {
                  signals.workspace.setWorkspaceHidden({ hidden: false });
                  signals.workspace.setWorkspaceItem({ item: id });
                }
              }}
            >
              <Icon />
            </IconContainer>
          </Tooltip>
        );
      })}
  </Container>
);

export default inject('signals', 'store')(observer(Navigation));
