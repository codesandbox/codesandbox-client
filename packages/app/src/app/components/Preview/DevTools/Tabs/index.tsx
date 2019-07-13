import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React from 'react';

import { IViewType, Status } from '../';

import { Actions, Container, Tabs } from './elements';
import DraggableTab, { PaneTab, TabProps } from './Tab';
import TabDropZone, { TabDropZoneProps } from './TabDropZone';

export interface ITabPosition {
  devToolIndex: number;
  tabPosition: number;
}

export interface Props {
  hidden: boolean;
  currentPaneIndex: number;
  panes: IViewType[];
  owned: boolean;
  setPane: (i: number) => void;
  devToolIndex: number;
  moveTab: (prevPos: ITabPosition, newPos: ITabPosition) => void;
  status?: { [title: string]: Status | undefined };
}

const DevToolTabs = ({
  panes,
  hidden,
  currentPaneIndex,
  devToolIndex,
  owned,
  setPane,
  moveTab,
  status,
}: Props) => {
  const currentPane = panes[currentPaneIndex];
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

          const TypedTab = (moveTab
            ? DraggableTab
            : (PaneTab as unknown)) as React.SFC<TabProps>;

          return (
            <TypedTab
              canDrag={panes.length !== 1}
              pane={pane}
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
              index={i}
              key={i} // eslint-disable-line react/no-array-index-key
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
        {actions.map(({ title, onClick, Icon, disabled }) => {
          return (
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
          );
        })}
      </Actions>
    </Container>
  );
};

export default DevToolTabs;
