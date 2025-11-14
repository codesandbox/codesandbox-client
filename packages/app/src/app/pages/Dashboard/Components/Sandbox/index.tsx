import React from 'react';
import { getEmptyImage } from 'react-dnd-html5-backend';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';

import { useActions, useAppState } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import track from '@codesandbox/common/lib/utils/analytics';
import { Icon } from '@codesandbox/components';

import { SandboxCard } from './SandboxCard';
import { SandboxListItem } from './SandboxListItem';
import { getTemplateIcon } from './TemplateIcon';
import { useSelection } from '../Selection';
import { DashboardSandbox, DashboardTemplate, PageTypes } from '../../types';
import { SandboxItemComponentProps } from './types';
import { useDrag } from '../../utils/dnd';

const PrivacyIcons = {
  0: null,
  1: () => <Icon name="link" size={12} />,
  2: () => <Icon name="lock" size={12} />,
};

interface GenericSandboxProps {
  page: PageTypes;
  isScrolling: boolean;
  item: DashboardSandbox | DashboardTemplate;
}

function getFolderName(item: GenericSandboxProps['item']): string | undefined {
  if (item.type === 'template') {
    const { sandbox } = item;
    if (sandbox.team) {
      return sandbox.team.name;
    }
    if (sandbox.author) {
      return sandbox.author.username;
    }
    if (sandbox.git) {
      return 'from GitHub';
    }
    return 'Templates';
  }
  const { sandbox } = item;

  if (sandbox.collection) {
    if (sandbox.collection.path === '/' && !('teamId' in sandbox)) {
      return undefined;
    }

    return sandbox.collection.path.split('/').pop();
  }

  return 'Drafts';
}

const GenericSandbox = ({ isScrolling, item, page }: GenericSandboxProps) => {
  const { user, dashboard, activeWorkspaceAuthorization } = useAppState();
  const actions = useActions();

  const { sandbox } = item;

  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;

  const sandboxLocation = getFolderName(item);

  let timeStampToUse: string | undefined;

  // 'lastAccessedAt' and 'updatedAt' are irrelevant for:
  // - deleted sandboxes
  if (page === 'recent' && 'lastAccessedAt' in sandbox) {
    timeStampToUse = sandbox.lastAccessedAt;
  } else if ('updatedAt' in sandbox) {
    timeStampToUse = sandbox.updatedAt;
  }

  let timeAgo: string | undefined;

  // timeStampToUse might be undefined due to the checks above, but
  // typescript is not smart enought to know.
  if (timeStampToUse) {
    const timeStampToUseDate = zonedTimeToUtc(timeStampToUse, 'Etc/UTC');
    const now = new Date();

    timeAgo = formatDistanceStrict(timeStampToUseDate, now, {
      addSuffix: true,
    });
  }

  const url = sandboxUrl(sandbox);

  let TemplateIcon:
    | React.ComponentType<{ width: string; height: string }>
    | undefined;

  // 'source' is not present in:
  // - deleted sandboxes
  if ('source' in sandbox) {
    TemplateIcon = getTemplateIcon(sandbox);
  }

  let PrivacyIcon: React.ComponentType | undefined;

  // 'privacy' is not present in:
  // - deleted sandboxes
  if ('privacy' in sandbox) {
    PrivacyIcon = PrivacyIcons[sandbox.privacy];
  }

  let restricted = false;

  // 'restricted' and 'draft' are not present in:
  // - deleted sandboxes
  if ('restricted' in sandbox) {
    restricted = sandbox.restricted;

    if ('draft' in sandbox) {
      restricted = sandbox.restricted && !sandbox.draft;
    }
  }

  let screenshotUrl: string | undefined;

  // 'screenshotUrl' is not present in:
  // - deleted sandboxes
  if ('screenshotUrl' in sandbox) {
    screenshotUrl = sandbox.screenshotUrl;
  }

  // TODO: Check if screnshotUrl fallback below is still relevant

  // We set a fallback thumbnail in the API which is used for
  // both old and new dashboard, we can move this logic to the
  // backend when we deprecate the old dashboard
  if (screenshotUrl === 'https://codesandbox.io/static/img/banner.png') {
    screenshotUrl = '/static/img/default-sandbox-thumbnail.png';
  }

  /** Access restrictions */
  let { noDrag } = item;

  if (activeWorkspaceAuthorization === 'READ') {
    noDrag = true;
  }

  /* Drag logic */

  const [, dragRef, preview] = useDrag({
    item,
    canDrag: !noDrag,
    end: (_item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (!dropResult || !dropResult.path) return;

      onDrop(dropResult);
    },
  });

  /* View logic */
  let { viewMode } = dashboard;

  if (page === 'deleted') {
    viewMode = 'list';
  }

  if (page === 'recent') {
    viewMode = 'grid';
  }

  const Component: React.FC<SandboxItemComponentProps> =
    viewMode === 'list' ? SandboxListItem : SandboxCard;

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onMouseDown,
    onRightClick,
    onMenuEvent,
    onBlur,
    onDragStart,
    onDrop,
    thumbnailRef,
    isDragging: isAnythingDragging,
    isRenaming,
    setRenaming,
  } = useSelection();

  const selected = selectedIds.includes(sandbox.id);
  const isDragging = isAnythingDragging && selected;

  const onClick = event => {
    onSelectionClick(event, sandbox.id);
  };

  const onContextMenu = React.useCallback(
    event => {
      event.preventDefault();
      if (event.type === 'contextmenu') onRightClick(event, sandbox.id);
      else onMenuEvent(event, sandbox.id);
    },
    [onRightClick, onMenuEvent, sandbox.id]
  );

  const onDoubleClick = event => {
    if (page === 'deleted') {
      // Can't open deleted items, they don't exist anymore so we open
      // the context menu instead.
      onContextMenu(event);
    } else if (event.ctrlKey || event.metaKey) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  /* Edit logic */

  const [newTitle, setNewTitle] = React.useState(sandboxTitle);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTitle(event.target.value);
    },
    [setNewTitle]
  );
  const onInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === ESC) {
        // Reset value and exit without saving
        setNewTitle(sandboxTitle);
        setRenaming(false);
      }
    },
    [setNewTitle, setRenaming, sandboxTitle]
  );

  const onSubmit = React.useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      if (event) event.preventDefault();
      await actions.dashboard.renameSandbox({
        id: sandbox.id,
        title: newTitle,
      });
      setRenaming(false);
      track('Dashboard - Rename sandbox', { dashboardVersion: 2 });
    },
    // eslint-disable-next-line
    [actions.dashboard, page, sandbox.id, newTitle, sandboxTitle, setRenaming]
  );

  const onInputBlur = React.useCallback(() => {
    // save value when you click outside or tab away
    onSubmit();
  }, [onSubmit]);

  const baseInteractions = {
    selected,
    onBlur,
    onContextMenu,
  };
  const interactionProps =
    page === 'recent'
      ? {
          ...baseInteractions,
          interaction: 'link' as const,
          as: 'a',
          href: url,
          style: {
            textDecoration: 'none',
          },
        }
      : {
          ...baseInteractions,
          interaction: 'button' as const,
          // Recent page does not support selection
          'data-selection-id': sandbox.id,
          tabIndex: '0',
          onClick,
          onMouseDown,
          onDoubleClick,
        };

  const sandboxProps = {
    noDrag,
    sandboxTitle,
    sandboxLocation,
    timeAgo,
    sandbox,
    TemplateIcon,
    PrivacyIcon,
    restricted,
    screenshotUrl,
    // edit mode
    editing: isRenaming && selected,
    newTitle,
    onChange,
    onInputKeyDown,
    onSubmit,
    onInputBlur,
    // drag preview
    thumbnailRef,
    isDragging,
  };

  const dragProps = sandboxProps.noDrag
    ? {}
    : {
        ref: dragRef,
        onDragStart: event => onDragStart(event, sandbox.id, 'sandbox'),
      };

  React.useEffect(() => {
    preview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }, [preview]);

  let username: string | undefined;

  // 'author' is not present in:
  // - deleted sandboxes
  if ('author' in sandbox) {
    username =
      sandbox.author.username === user?.username
        ? 'you'
        : sandbox.author.username;
  }

  return (
    <div {...dragProps} style={{ height: '100%' }}>
      <Component
        {...sandboxProps}
        {...interactionProps}
        isScrolling={isScrolling}
        username={username}
      />
    </div>
  );
};

/**
 * Used on the Recent page and in the VariableGrid
 */
export const Sandbox = GenericSandbox;
