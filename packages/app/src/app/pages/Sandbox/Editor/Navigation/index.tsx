import * as React from 'react';
import { connect } from 'app/fluent';

import GitHubIcon from 'react-icons/lib/go/mark-github';

import workspaceItems from 'app/store/modules/workspace/items';
import Tooltip from 'common/components/Tooltip';

import InfoIcon from './InfoIcon';
import FilesIcon from './FileIcon';
import RocketIcon from './RocketIcon';
import ConfigurationIcon from './ConfigurationIcon';

import { Container, IconContainer } from './elements';

const IDS_TO_ICONS = {
  project: InfoIcon,
  files: FilesIcon,
  github: GitHubIcon,
  deploy: RocketIcon,
  config: ConfigurationIcon,
};

export default connect()
  .with(({ state, signals }) => ({
    workspaceItems: state.workspace.items.get(),
    openedWorkspaceItem: state.workspace.openedWorkspaceItem,
    setWorkspaceItem: signals.workspace.setWorkspaceItem
  }))
  .to(
    function Navigation ({ openedWorkspaceItem, setWorkspaceItem })  {
      return (
        <Container>
          {workspaceItems.filter(w => !w.show).map(item => {
            const { id, name } = item;
            const Icon = IDS_TO_ICONS[id];
            const selected = id === openedWorkspaceItem;
            return (
              <Tooltip key={id} position="right" title={name}>
                <IconContainer
                  selected={selected}
                  onClick={() => {
                    if (selected) {
                      setWorkspaceItem({ item: null });
                    } else {
                      setWorkspaceItem({ item: id });
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
    }
  )
