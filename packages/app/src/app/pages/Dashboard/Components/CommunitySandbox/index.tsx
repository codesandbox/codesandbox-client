import React from 'react';
import { useHistory } from 'react-router-dom';

import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { formatNumber } from '@codesandbox/components/lib/components/Stats';
import { SandboxCard } from './CommunitySandboxCard';
import { getTemplateIcon } from './TemplateIcon';
import { useSelection } from '../Selection';
import { DashboardCommunitySandbox } from '../../types';

interface GenericSandboxProps {
  isScrolling: boolean;
  item: DashboardCommunitySandbox;
}

export const CommunitySandbox = ({
  isScrolling,
  item,
}: GenericSandboxProps) => {
  const { sandbox } = item;
  const sandboxTitle = sandbox.title || sandbox.alias || sandbox.id;
  const viewCount = formatNumber(sandbox.viewCount);
  const url = sandboxUrl({
    id: sandbox.id,
    alias: sandbox.alias,
  });

  const TemplateIcon = getTemplateIcon(sandbox);

  let screenshotUrl = sandbox.screenshotUrl;
  // We set a fallback thumbnail in the API which is used for
  // both old and new dashboard, we can move this logic to the
  // backend when we deprecate the old dashboard
  if (screenshotUrl === 'https://codesandbox.io/static/img/banner.png') {
    screenshotUrl = '/static/img/default-sandbox-thumbnail.png';
  }

  // interactions
  const {
    selectedIds,
    onClick: onSelectionClick,
    onMouseDown,
    onRightClick,
    onMenuEvent,
  } = useSelection();

  const selected = selectedIds.includes(sandbox.id);

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
    if (event.ctrlKey || event.metaKey) window.open(url, '_blank');
    else history.push(url);

    track('Dashboard - Community Search sandbox opened');
  };

  const sandboxProps = {
    sandboxTitle,
    viewCount,
    sandbox,
    TemplateIcon,
    screenshotUrl,
  };

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
    'data-selection-id': sandbox.id,
  };

  return (
    <div>
      <SandboxCard
        {...sandboxProps}
        {...interactionProps}
        isScrolling={isScrolling}
      />
    </div>
  );
};
