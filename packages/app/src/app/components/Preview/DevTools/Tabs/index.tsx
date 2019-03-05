import * as React from 'react';

import Tooltip from 'common/lib/components/Tooltip';

import { IViewType } from '..';
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
}

const DevToolTabs = ({
  panes,
  hidden,
  currentPaneIndex,
  devToolIndex,
  owned,
  setPane,
  moveTab,
}: Props) => {
  const currentPane = panes[currentPaneIndex];
  const actions =
    typeof currentPane.actions === 'function'
      ? currentPane.actions(owned)
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
              key={i}
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
        {actions.map(({ title, onClick, Icon }) => (
          <Tooltip
            style={{ pointerEvents: hidden ? 'none' : 'initial' }}
            title={title}
            key={title}
          >
            <Icon
              style={{
                opacity: hidden ? 0 : 1,
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
