import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { TippyProps } from '@tippy.js/react';
import { useAppState, useActions } from 'app/overmind';
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
  SearchIcon,
} from './icons';

const IDS_TO_ICONS = {
  project: InfoIcon,
  'project-summary': InfoIcon,
  'github-summary': GithubIcon,
  files: ExplorerIcon,
  search: SearchIcon,
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
  const { setWorkspaceHidden, setWorkspaceItem } = useActions().workspace;
  const {
    workspace: { openedWorkspaceItem, workspaceHidden },
    git: { gitChanges, isFetching, conflicts },
  } = useAppState();

  const Icon = IDS_TO_ICONS[id];
  const selected = !workspaceHidden && id === openedWorkspaceItem;
  const hasChanges =
    gitChanges.added.length +
      gitChanges.deleted.length +
      gitChanges.modified.length >
    0;
  const hasConflicts = Boolean(conflicts.length);

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
        {id === 'github' && (hasChanges || isFetching || hasConflicts) && (
          <Element
            css={css({
              position: 'absolute',
              left: 31,
              top: 0,
              // eslint-disable-next-line no-nested-ternary
              backgroundColor: isFetching
                ? 'yellow'
                : hasConflicts
                ? 'reds.500'
                : 'blues.500',
              borderRadius: '50%',
              width: '6px',
              height: '6px',
              transform: 'translateY(50%)',
            })}
          />
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
  const state = useAppState();
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
            {!shownItems.length && !disabledItems.length ? <div /> : null}

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
