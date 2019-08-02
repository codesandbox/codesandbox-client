import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { ViewTab } from '@codesandbox/common/lib/templates/template';

import { Status, IViews } from '..';
import { Actions, Container, Tabs } from './elements';
import DraggableTab, { PaneTab, TabProps } from './Tab';
import TabDropZone, { TabDropZoneProps } from './TabDropZone';
// import { AddTab } from './AddTab';

export interface ITabPosition {
  devToolIndex: number;
  tabPosition: number;
}

export interface Props {
  hidden: boolean;
  currentPaneIndex: number;
  owned: boolean;
  setPane: (i: number) => void;
  devToolIndex: number;
  moveTab?: (prevPos: ITabPosition, newPos: ITabPosition) => void;
  closeTab?: (pos: ITabPosition) => void;
  status?: { [title: string]: Status | undefined };

  panes: ViewTab[];
  views: IViews;
}

const DevToolTabs = ({
  panes,
  views,
  hidden,
  currentPaneIndex,
  devToolIndex,
  owned,
  setPane,
  moveTab,
  closeTab,
  status,
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
        {panes.map((pane, i) => {
          const active = !hidden && i === currentPaneIndex;
          const view = views[pane.id];

          const TypedTab = (moveTab
            ? DraggableTab
            : (PaneTab as unknown)) as React.SFC<TabProps>;

          /* eslint-disable react/no-array-index-key */
          return (
            <TypedTab
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
              moveTab={moveTab}
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

        {/* <AddTab /> */}

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

export default DevToolTabs;
