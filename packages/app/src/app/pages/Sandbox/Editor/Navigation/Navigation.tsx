import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent } from 'react';
import PlusIcon from 'react-icons/lib/go/plus';

import { useOvermind } from 'app/overmind';
import getWorkspaceItems, {
  getDisabledItems,
  INavigationItem,
} from 'app/store/modules/workspace/items';

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import InfoIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/sandbox.svg';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import GitHubIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/github.svg';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import LiveIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/live.svg';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import FilesIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/file.svg';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import RocketIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/rocket.svg';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import ConfigurationIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/cog.svg';

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

type IconProps = {
  item: INavigationItem;
  isDisabled?: boolean;
};
const IconComponent: FunctionComponent<IconProps> = ({
  item: { id, name },
  isDisabled,
}) => {
  const {
    actions: {
      workspace: { setWorkspaceHidden, setWorkspaceItem },
    },
    state: {
      workspace: { openedWorkspaceItem, workspaceHidden },
    },
  } = useOvermind();

  const Icon = IDS_TO_ICONS[id];
  const selected = !workspaceHidden && id === openedWorkspaceItem;

  return (
    <Tooltip placement="right" content={name}>
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
};

type Props = {
  topOffset: number;
  bottomOffset: number;
};
export const Navigation: FunctionComponent<Props> = ({
  topOffset,
  bottomOffset,
}) => {
  const { state } = useOvermind();

  const shownItems = getWorkspaceItems(state);
  const disabledItems = getDisabledItems(state);

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
};
