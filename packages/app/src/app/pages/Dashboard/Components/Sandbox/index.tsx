import React from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { getEmptyImage } from 'react-dnd-html5-backend';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';

import { useActions, useAppState } from 'app/overmind';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import track, {
  trackImprovedDashboardEvent,
} from '@codesandbox/common/lib/utils/analytics';
import { Icon } from '@codesandbox/components';
import { formatNumber } from '@codesandbox/components/lib/components/Stats';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { SandboxCard } from './SandboxCard';
import { SandboxListItem } from './SandboxListItem';
import { getTemplateIcon } from './TemplateIcon';
import { useSelection } from '../Selection';
import { DashboardSandbox, DashboardTemplate, PageTypes } from '../../types';
import { SandboxItemComponentProps } from './types';
import { useDrag } from '../../utils/dnd';

const MAP_SANDBOX_EVENT_TO_PAGE_TYPE: Partial<Record<PageTypes, string>> = {
  recent: 'Dashboard - Open Sandbox from Recent',
  drafts: 'Dashboard - Open Sandbox from My Drafts',
  sandboxes: 'Dashboard - Open Sandbox from Sandboxes',
};

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
  const { isFree } = useWorkspaceSubscription();

  const { sandbox } = item;

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

  const url = sandboxUrl(sandbox);

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
  const restricted = isFree && sandbox.privacy !== 0;

  const sandboxAnalyticsEvent = !autoFork
    ? MAP_SANDBOX_EVENT_TO_PAGE_TYPE[page]
    : null;

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
    // Can't open deleted items, they don't exist anymore
    if (location.pathname.includes('deleted')) {
      onContextMenu(event);
      return;
    }

    // Templates in Home should fork, everything else opens
    if (event.ctrlKey || event.metaKey) {
      if (autoFork) {
        track('Dashboard - Recent template forked', {
          source: 'Home',
          dashboardVersion: 2,
        });
        actions.editor.forkExternalSandbox({
          sandboxId: sandbox.id,
          openInNewWindow: true,
        });
      } else {
        if (sandboxAnalyticsEvent) {
          trackImprovedDashboardEvent(sandboxAnalyticsEvent);
        }
        window.open(url, '_blank');
      }
    } else if (autoFork) {
      actions.editor.forkExternalSandbox({
        sandboxId: sandbox.id,
      });
    } else {
      if (sandboxAnalyticsEvent) {
        trackImprovedDashboardEvent(sandboxAnalyticsEvent);
      }
      if (sandbox.isV2) {
        window.location.href = url;
      } else {
        history.push(url);
      }
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
          as: sandbox.isV2 ? 'a' : Link,
          to: sandbox.isV2 ? undefined : url,
          href: sandbox.isV2 ? url : undefined,
          onClick: () => {
            if (sandboxAnalyticsEvent) {
              trackImprovedDashboardEvent(sandboxAnalyticsEvent);
            }
          },
          style: {
            outline: 'none',
            textDecoration: 'none',
          },
        }
      : {
          ...baseInteractions,
          // Recent page does not support selection
          'data-selection-id': sandbox.id,
          tabIndex: '0',
          onClick,
          onMouseDown,
          onDoubleClick,
        };

  const sandboxProps = {
    autoFork,
    noDrag,
    sandboxTitle,
    sandboxLocation,
    lastUpdated,
    viewCount,
    sandbox,
    TemplateIcon,
    PrivacyIcon,
    screenshotUrl,
    restricted,
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
    <div {...dragProps} css={{ height: '100%' }}>
      <Component
        {...sandboxProps}
        {...interactionProps}
        isScrolling={isScrolling}
      />
    </div>
  );
};

export const Sandbox = GenericSandbox;
