import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { TippyProps } from '@tippy.js/react';
import { useOvermind } from 'app/overmind';
import getWorkspaceItems, {
  INavigationItem,
  getDisabledItems,
} from 'app/overmind/utils/items';
import React, { FunctionComponent } from 'react';
import PlusIcon from 'react-icons/lib/go/plus';

import { Container, IconContainer } from './elements';
import {
  CommentsIcon,
  DeployIcon,
  ExplorerIcon,
  GithubIcon,
  InfoIcon,
  LiveIcon,
  ServerIcon,
  SettingsIcon,
} from './icons';

const IDS_TO_ICONS = {
  project: InfoIcon,
  'project-summary': InfoIcon,
  'github-summary': GithubIcon,
  files: ExplorerIcon,
  github: GithubIcon,
  deploy: DeployIcon,
  config: SettingsIcon,
  live: LiveIcon,
  more: PlusIcon,
  server: ServerIcon,
  comments: CommentsIcon,
};

type IconProps = {
  item: INavigationItem;
  isDisabled?: boolean;
  singleton: TippyProps['singleton'];
};
const IconComponent: FunctionComponent<IconProps> = ({
  item: { id, name },
  isDisabled,
  singleton,
}) => {
  const {
    actions: {
      workspace: { setWorkspaceHidden, setWorkspaceItem },
    },
    state: {
      workspace: { openedWorkspaceItem, workspaceHidden },
      git: { gitChanges },
    },
  } = useOvermind();

  const Icon = IDS_TO_ICONS[id];
  const selected = !workspaceHidden && id === openedWorkspaceItem;

  return (
    <Tooltip content={name} singleton={singleton}>
      <IconContainer
        css={{
          position: 'relative',
        }}
        justify="center"
        align="center"
        isDisabled={isDisabled}
        selected={selected}
        as="button"
        aria-label={name}
        onClick={() => {
          if (selected) {
            setWorkspaceHidden({ hidden: true });
          } else {
            setWorkspaceHidden({ hidden: false });
            setWorkspaceItem({ item: id });
          }
        }}
      >
        <Icon aria-hidden />
        {id === 'github' && (
          <span
            style={{
              position: 'absolute',
              bottom: 5,
              right: 5,
              backgroundColor: 'blue',
              borderRadius: '50%',
              width: 15,
              height: 15,
              fontSize: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {gitChanges.added.length +
              gitChanges.deleted.length +
              gitChanges.modified.length}
          </span>
        )}
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
    // @ts-ignore
    <Container
      align="center"
      direction="vertical"
      gap={4}
      topOffset={topOffset}
      bottomOffset={bottomOffset}
      // @ts-ignore
      as="nav"
      aria-label="Sandbox Navigation"
    >
      <SingletonTooltip placement="right">
        {singleton => (
          <>
            {shownItems.map(item => (
              <IconComponent key={item.id} item={item} singleton={singleton} />
            ))}

            {disabledItems.map(item => (
              <IconComponent
                key={item.id}
                item={item}
                singleton={singleton}
                isDisabled
              />
            ))}
          </>
        )}
      </SingletonTooltip>
    </Container>
  );
};
