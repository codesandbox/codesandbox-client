import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { ViewTab } from '@codesandbox/common/lib/templates/template';
import { DevToolsTabPosition } from '@codesandbox/common/lib/types';
import track from '@codesandbox/common/lib/utils/analytics';

import { Status, IViews } from '..';
import { Actions, Container, Tabs } from './elements';
import { DraggableTab, PaneTab, TabProps } from './Tab';
import { TabDropZone, TabDropZoneProps } from './TabDropZone';

interface Props {
  hidden: boolean;
  currentPaneIndex: number;
  owned: boolean;
  setPane: (i: number) => void;
  devToolIndex: number;
  moveTab?: (prevPos: DevToolsTabPosition, newPos: DevToolsTabPosition) => void;
  closeTab?: (pos: DevToolsTabPosition) => void;
  status?: { [title: string]: Status | undefined };

  panes: ViewTab[];
  views: IViews;
  disableLogging: boolean;
  isOnEmbedPage: boolean;
  isOnPrem: boolean;
}

export const DevToolTabs = ({
  panes,
  views,
  hidden,
  currentPaneIndex,
  devToolIndex,
  owned,
  setPane,
  moveTab,
  closeTab,
  disableLogging,
  status,
  isOnEmbedPage,
  isOnPrem,
}: Props) => {
  const currentPane = views[panes[currentPaneIndex].id];
  const actions =
    typeof currentPane.actions === 'function'
      ? currentPane.actions({ owned })
      : currentPane.actions;

  const TypedTabDropZone = (TabDropZone as unknown) as React.SFC<
    TabDropZoneProps
  >;

  return (
    <Container>
      <Tabs>
        {panes
          .filter(pane => (isOnEmbedPage ? !pane.hideOnEmbedPage : true))
          .filter(pane => (isOnPrem ? !pane.hideOnEmbedPage : true))
          .map((pane, i) => {
            const active = !hidden && i === currentPaneIndex;
            const view = views[pane.id];

            const TypedTab = (moveTab
              ? DraggableTab
              : (PaneTab as unknown)) as React.SFC<TabProps>;

            /* eslint-disable react/no-array-index-key */
            return (
              <TypedTab
                disableLogging={disableLogging}
                canDrag={panes.length !== 1}
                pane={view}
                options={pane.options || {}}
                active={active}
                onMouseDown={e => {
                  e.stopPropagation();
                }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPane(i);
                }}
                devToolIndex={devToolIndex}
                moveTab={(prevPos, newPos) => {
                  if (moveTab) {
                    track('DevTools - Move Pane', {
                      pane: view.id,
                    });
                    moveTab(prevPos, newPos);
                  }
                }}
                closeTab={
                  pane.closeable && panes.length !== 1 ? closeTab : undefined
                }
                index={i}
                key={i}
                status={
                  status
                    ? status[pane.id] || { unread: 0, type: 'info' }
                    : undefined
                }
              />
            );
          })}

        {moveTab && (
          <TypedTabDropZone
            index={panes.length}
            devToolIndex={devToolIndex}
            moveTab={moveTab}
          />
        )}
      </Tabs>

      <Actions>
        {actions.map(({ title, onClick, Icon, disabled }) => (
          <Tooltip
            style={{
              pointerEvents: hidden ? 'none' : 'initial',
            }}
            content={title}
            key={title}
            delay={disabled ? [0, 0] : [500, 0]}
          >
            <Icon
              style={{
                // eslint-disable-next-line  no-nested-ternary
                opacity: hidden ? 0 : disabled ? 0.5 : 1,
                pointerEvents: disabled ? 'none' : 'initial',
              }}
              onClick={onClick}
              key={title}
            />
          </Tooltip>
        ))}
      </Actions>
    </Container>
  );
};
