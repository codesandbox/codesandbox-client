import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { getEmptyImage } from 'react-dnd-html5-backend';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';

import { useActions, useAppState } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import track from '@codesandbox/common/lib/utils/analytics';
import { Icon } from '@codesandbox/components';
import { formatNumber } from '@codesandbox/components/lib/components/Stats';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { SandboxListItem, SkeletonListItem } from './SandboxListItem';
import { getTemplateIcon } from './TemplateIcon';
import { useSelection } from '../Selection';
import { DashboardSandbox, DashboardTemplate, PageTypes } from '../../types';
import { SandboxItemComponentProps } from './types';
import { useDrag } from '../../utils/dnd';

const PrivacyIcons = {
  0: () => null,
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
    if (sandbox.collection.path === '/' && !sandbox.teamId) {
      return undefined;
    }

    return sandbox.collection.path.split('/').pop();
  }

  return 'Drafts';
}

const GenericSandbox = ({ isScrolling, item, page }: GenericSandboxProps) => {
  const { dashboard, activeWorkspaceAuthorization } = useAppState();
  const actions = useActions();

  const { sandbox, type } = item;

  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;

  const sandboxLocation = getFolderName(item);

  const lastUpdated = formatDistanceStrict(
    zonedTimeToUtc(sandbox.updatedAt, 'Etc/UTC'),
    new Date(),
    {
      addSuffix: true,
    }
  );

  const viewCount = formatNumber(sandbox.viewCount);

  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const TemplateIcon = getTemplateIcon(sandbox);
  const PrivacyIcon = PrivacyIcons[sandbox.privacy || 0];

  let screenshotUrl = sandbox.screenshotUrl;
  // We set a fallback thumbnail in the API which is used for
  // both old and new dashboard, we can move this logic to the
  // backend when we deprecate the old dashboard
  if (screenshotUrl === 'https://codesandbox.io/static/img/banner.png') {
    screenshotUrl = '/static/img/default-sandbox-thumbnail.png';
  }

  /* Drag logic */

  const location = useLocation();

  const [, dragRef, preview] = useDrag({
    item,
    end: (_item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (!dropResult || !dropResult.path) return;

      onDrop(dropResult);
    },
  });

  /* View logic */
  let viewMode: string;

  if (location.pathname.includes('deleted')) viewMode = 'list';
  else viewMode = dashboard.viewMode;

  const Component: React.FC<SandboxItemComponentProps> =
    viewMode === 'list' ? SandboxListItem : SandboxCard;

  /** Access restrictions */
  let { noDrag, autoFork } = item;
  if (activeWorkspaceAuthorization === 'READ') {
    noDrag = true;
    autoFork = false;
  }

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

  const history = useHistory();
  const onDoubleClick = event => {
    // can't open deleted items, they don't exist anymore
    if (location.pathname.includes('deleted')) {
      onContextMenu(event);
      return;
    }

    // Templates in Home should fork, everything else opens
    if (event.ctrlKey || event.metaKey) {
      if (autoFork) {
        actions.editor.forkExternalSandbox({
          sandboxId: sandbox.id,
          openInNewWindow: true,
        });
      } else {
        window.open(url, '_blank');
      }
      track('Dashboard - Recent template forked', {
        source: 'Home',
        dashboardVersion: 2,
      });
    } else if (autoFork) {
      actions.editor.forkExternalSandbox({
        sandboxId: sandbox.id,
      });
    } else {
      history.push(url);
    }
    track('Dashboard - Recent sandbox opened', {
      source: 'Home',
      dashboardVersion: 2,
    });
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

  const interactionProps = {
    tabIndex: 0, // make div focusable
    style: {
      outline: 'none',
    }, // we handle outline with border
    selected,
    onClick,
    onMouseDown,
    onDoubleClick,
    onContextMenu,
    onBlur,
    'data-selection-id': sandbox.id,
  };

  const sandboxProps = {
    autoFork,
    noDrag,
    sandboxTitle,
    sandboxLocation,
    lastUpdated,
    viewCount,
    sandbox,
    isTemplate: type === 'template',
    alwaysOn: sandbox.alwaysOn,
    TemplateIcon,
    PrivacyIcon,
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
    opacity: isDragging ? 0.25 : 1,
  };

  const dragProps = sandboxProps.noDrag
    ? {}
    : {
        ref: dragRef,
        onDragStart: event => onDragStart(event, sandbox.id),
      };

  React.useEffect(() => {
    preview(getEmptyImage(), {
      captureDraggingState: true,
    });
  }, [preview]);

  if (page === 'liked') {
    return (
      <Component
        {...sandboxProps}
        {...interactionProps}
        isScrolling={isScrolling}
      />
    );
  }

  return (
    <div {...dragProps}>
      <Component
        {...sandboxProps}
        {...interactionProps}
        isScrolling={isScrolling}
      />
    </div>
  );
};

export const Sandbox = GenericSandbox;

export const SkeletonSandbox = () => {
  const { dashboard } = useAppState();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else viewMode = dashboard.viewMode;

  if (viewMode === 'list') {
    return <SkeletonListItem />;
  }
  return <SkeletonCard />;
};
