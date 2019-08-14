import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import PlusIcon from 'react-icons/lib/go/plus';
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
import getWorkspaceItems, {
  getDisabledItems,
  INavigationItem,
} from 'app/store/modules/workspace/items';
import { Container, IconContainer, Separator } from './elements';
import ServerIcon from './ServerIcon';

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

interface IconProps {
  item: INavigationItem;
  isDisabled?: boolean;
  store: any;
  signals: any;
}

const IconComponent = inject('store', 'signals')(
  hooksObserver(
    ({
      item,
      isDisabled,
      store,
      signals: {
        workspace: { setWorkspaceHidden, setWorkspaceItem },
      },
    }: IconProps) => {
      const { id, name } = item;

      const Icon = IDS_TO_ICONS[id];
      const selected =
        !store.workspace.workspaceHidden &&
        id === store.workspace.openedWorkspaceItem;
      return (
        <Tooltip key={id} placement="right" content={name}>
          <IconContainer
            isDisabled={isDisabled}
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
    }
  )
);

export const Navigation = inject('store')(
  hooksObserver(
    ({
      topOffset,
      bottomOffset,
      store,
    }: {
      topOffset: number;
      bottomOffset: number;
      store: any;
    }) => {
      const shownItems = getWorkspaceItems(store);
      const disabledItems = getDisabledItems(store);

      return (
        <Container topOffset={topOffset} bottomOffset={bottomOffset}>
          {shownItems.map(item => (
            <IconComponent key={item.id} item={item} />
          ))}

          {disabledItems.length > 0 && <Separator />}

          {disabledItems.map(item => (
            <IconComponent key={item.id} item={item} isDisabled />
          ))}
        </Container>
      );
    }
  )
);
