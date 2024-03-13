import {
  IconNames,
  Link,
  SidebarListAction,
  Stack,
  Icon,
  Text,
} from '@codesandbox/components';
import { PageTypes } from 'app/overmind/namespaces/dashboard/types';
import React from 'react';
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import css from '@styled-system/css';
import { trackImprovedDashboardEvent } from '@codesandbox/common/lib/utils/analytics';
import { CSSProperties } from 'styled-components';
import { DragItemType, useDrop } from '../utils/dnd';
import {
  SidebarContext,
  MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE,
  linkStyles,
} from './utils';

const canNotAcceptSandboxes: PageTypes[] = ['recent'];
const canNotAcceptFolders: PageTypes[] = ['recent', 'drafts', 'templates'];

const isSamePath = (
  draggedItem: DragItemType,
  currentPage: PageTypes,
  dropPath: string
) => {
  if (!draggedItem) return false;

  if (
    draggedItem.type === 'sandbox' &&
    draggedItem.sandbox.collection?.path === dropPath
  ) {
    return true;
  }

  if (draggedItem.type === 'template' && currentPage === 'templates') {
    return true;
  }

  if (
    draggedItem.type === 'folder' &&
    (draggedItem.path === dropPath || draggedItem.parent === dropPath)
  ) {
    return true;
  }

  return false;
};

interface RowItemProps {
  name: string;
  path: string;
  icon: IconNames;
  page: PageTypes;
  setFoldersVisibility?: (val: boolean) => void;
  folderPath?: string;
  nestingLevel?: number;
  style?: CSSProperties;
}

export const RowItem: React.FC<RowItemProps> = ({
  name,
  path,
  folderPath = path,
  nestingLevel = 0,
  page,
  icon,
  setFoldersVisibility = null,
  style = {},
  ...props
}) => {
  const accepts: Array<'sandbox' | 'folder' | 'template'> = [];
  if (!canNotAcceptSandboxes.includes(page)) {
    accepts.push('template');
    accepts.push('sandbox');
  }
  if (!canNotAcceptFolders.includes(page)) accepts.push('folder');

  const usedPath = folderPath || path;
  const [{ canDrop, isOver, isDragging }, dropRef] = useDrop({
    accept: accepts,
    drop: item => ({
      page,
      path: usedPath,
      isSamePath: isSamePath(item, page, usedPath),
    }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop:
        monitor.canDrop() &&
        page === 'sandboxes' &&
        !isSamePath(monitor.getItem(), page, usedPath),
      isDragging: !!monitor.getItem(),
    }),
  });

  const { onSidebarToggle } = React.useContext(SidebarContext);

  const linkTo: string = path;

  const location = useLocation();
  const isCurrentLink = linkTo.replace(/\?.*/, '') === location.pathname;
  const history = useHistory();

  /** Toggle nested folders when user
   * is drags an item over a folder after a treshold
   * We open All Sandboxes instantly because that's the root
   * and you can't drop anything in it
   */
  const HOVER_THRESHOLD = folderPath === '/' ? 0 : 500; // ms
  const isOverCache = React.useRef(false);

  React.useEffect(() => {
    if (!isOver) isOverCache.current = false;
    else isOverCache.current = true;

    const handler = () => {
      if (isOverCache.current && setFoldersVisibility) {
        setFoldersVisibility(true);
      }
    };

    const timer = window.setTimeout(handler, HOVER_THRESHOLD);
    return () => window.clearTimeout(timer);
  }, [isOver, setFoldersVisibility, HOVER_THRESHOLD]);

  return (
    <SidebarListAction
      ref={dropRef}
      align="center"
      onClick={onSidebarToggle}
      css={css({
        minHeight: nestingLevel ? '32px' : '36px',
        paddingX: 0,
        opacity: isDragging && !canDrop ? 0.25 : 1,
        display: 'flex',
        flexDirection: 'column',
        color: isCurrentLink ? 'sideBar.foreground' : 'sideBarTitle.foreground',
        backgroundColor:
          canDrop && isOver ? 'list.hoverBackground' : 'transparent',
        ...style,
      })}
    >
      {props.children || (
        <Link
          {...{
            ...(page === 'external' ? { href: linkTo } : { to: linkTo }),
            as: page === 'external' ? 'a' : RouterLink,
            style: linkStyles,
            css: {
              '&:focus-visible': {
                outlineOffset: '-1px',
                outline: '1px solid #ac9cff',
              },
            },
            onKeyDown: event => {
              if (event.keyCode === ENTER) {
                history.push(linkTo, { focus: 'FIRST_ITEM' });
              }
            },
            onClick: () => {
              const event = MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page];
              if (event) {
                trackImprovedDashboardEvent(
                  MAP_SIDEBAR_ITEM_EVENT_TO_PAGE_TYPE[page]
                );
              }

              return false;
            },
          }}
          title={`Open ${name}`}
        >
          <Stack
            as="span"
            css={{
              width: '42px',
              paddingLeft: '16px',
              paddingRight: '4px',
              flexShrink: 0,
              overflow: 'hidden',
            }}
            align="center"
            justify="center"
          >
            <Icon name={icon} />
          </Stack>
          <Text truncate lineHeight="16px" color="inherit">
            {name}
          </Text>
        </Link>
      )}
    </SidebarListAction>
  );
};
