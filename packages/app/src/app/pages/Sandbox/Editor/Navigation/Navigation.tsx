import React from 'react';
import { observer } from 'mobx-react-lite';
import PlusIcon from 'react-icons/lib/go/plus';
import ServerIcon from 'react-icons/lib/go/server';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
// @ts-ignore
import InfoIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/sandbox.svg';
// @ts-ignore
import GitHubIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/github.svg';
// @ts-ignore
import LiveIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/live.svg';
// @ts-ignore
import FilesIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/file.svg';
// @ts-ignore
import RocketIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/rocket.svg';
// @ts-ignore
import ConfigurationIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/cog.svg';
import getWorkspaceItems from 'app/store/modules/workspace/items';
import { useSignals, useStore } from 'app/store';
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

export const Navigation = observer(
  ({
    topOffset,
    bottomOffset,
  }: {
    topOffset: number;
    bottomOffset: number;
  }) => {
    const {
      workspace: { setWorkspaceHidden, setWorkspaceItem },
    } = useSignals();
    const store = useStore();

    return (
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
              <Tooltip key={id} placement="right" content={name}>
                <IconContainer
                  selected={selected}
                  onClick={() => {
                    if (selected) {
                      setWorkspaceHidden({ hidden: true });
                    } else {
                      setWorkspaceHidden({ hidden: false });
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
);
