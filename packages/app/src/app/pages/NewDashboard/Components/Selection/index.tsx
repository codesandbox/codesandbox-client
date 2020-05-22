import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import {
  ARROW_LEFT,
  ARROW_RIGHT,
  ARROW_DOWN,
  ARROW_UP,
} from '@codesandbox/common/lib/utils/keycodes';
import { DragPreview } from './DragPreview';

const Context = React.createContext({
  sandboxes: [],
  selectedIds: [],
  onClick: (event: React.MouseEvent<HTMLDivElement>, sandboxId: string) => {},
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => {},
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {},
  thumbnailRef: null,
});

export const SelectionProvider = ({ sandboxes = [], ...props }) => {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const {
    state: { dashboard },
  } = useOvermind();

  const onClick = (
    event: React.MouseEvent<HTMLDivElement>,
    sandboxId: string
  ) => {
    if (event.ctrlKey || event.metaKey) {
      // select multiple with modifier

      if (selectedIds.includes(sandboxId)) {
        setSelectedIds(selectedIds.filter(id => id !== sandboxId));
      } else {
        setSelectedIds([...selectedIds, sandboxId]);
      }

      event.stopPropagation();
    } else if (event.shiftKey) {
      // start = find index for last inserted
      // end = find index for sandboxId
      // find everything in between and add them
      const start = sandboxes.findIndex(
        sandbox => sandbox.id === selectedIds[selectedIds.length - 1]
      );
      const end = sandboxes.findIndex(sandbox => sandbox.id === sandboxId);

      const sandboxesInRange = [];

      if (start >= 0 && end >= 0) {
        const increment = end > start ? +1 : -1;

        for (
          let index = start;
          increment > 0 ? index <= end : index >= end;
          index += increment
        ) {
          sandboxesInRange.push(sandboxes[index].id);
        }
      } else {
        sandboxesInRange.push(sandboxId);
      }

      // Missing feature: When you create a new selection that overlaps
      // with the existing selection, you're probably trying to unselect them
      // commonIds = sandboxesInRange.filter(id => selectedIds.length)
      // remove the common ones while adding the rest

      setSelectedIds([...selectedIds, ...sandboxesInRange]);

      event.stopPropagation();
    } else {
      setSelectedIds([sandboxId]);
      event.stopPropagation();
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.bubbles) {
      // do nothing, another sandbox was selected
    } else {
      // reset selection
      setSelectedIds([]);
    }
  };

  const onContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // global blur
    setSelectedIds([]);
  };

  let viewMode: string;
  const location = useLocation();

  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selectedIds.length) return;

    // if isn't one of the handled keys, skip
    if (
      (viewMode === 'grid' &&
        event.keyCode !== ARROW_RIGHT &&
        event.keyCode !== ARROW_LEFT) ||
      (viewMode === 'list' &&
        event.keyCode !== ARROW_DOWN &&
        event.keyCode !== ARROW_UP)
    ) {
      return;
    }

    // cancel scroll events
    event.preventDefault();

    const lastSelectedSandboxId = selectedIds[selectedIds.length - 1];

    const index = sandboxes.findIndex(
      sandbox => sandbox.id === lastSelectedSandboxId
    );

    const direction = [ARROW_RIGHT, ARROW_DOWN].includes(event.keyCode)
      ? 'forward'
      : 'backward';

    const nextSandbox = sandboxes[index + (direction === 'forward' ? 1 : -1)];

    // boundary conditions
    if (!nextSandbox) return;

    // scroll to newly selected element into view imperatively
    scrollIntoViewport(nextSandbox.id);

    // just moving around
    if (!event.shiftKey) {
      setSelectedIds([nextSandbox.id]);
      return;
    }

    // selection:
    // going back! remove the last one
    if (selectedIds.includes(nextSandbox.id)) {
      setSelectedIds(selectedIds.slice(0, -1));
      return;
    }

    // select one more
    setSelectedIds([...selectedIds, nextSandbox.id]);
  };

  // attach to thumbnail, we use this to calculate size
  const thumbnailRef = React.useRef<HTMLDivElement>();

  return (
    <Context.Provider
      value={{
        sandboxes: sandboxes || [],
        selectedIds,
        onClick,
        onBlur,
        onKeyDown,
        thumbnailRef,
      }}
    >
      <Element onClick={onContainerClick}>{props.children}</Element>
      <DragPreview
        sandboxes={sandboxes}
        selectedIds={selectedIds}
        thumbnailRef={thumbnailRef}
        viewMode={viewMode}
      />
    </Context.Provider>
  );
};

export const useSelection = () => {
  const {
    sandboxes,
    selectedIds,
    onClick,
    onBlur,
    onKeyDown,
    thumbnailRef,
  } = React.useContext(Context);

  return { sandboxes, selectedIds, onClick, onBlur, onKeyDown, thumbnailRef };
};

const scrollIntoViewport = sandboxId => {
  // we use data attributes to target element
  const element = document.querySelector(`[data-sandbox="${sandboxId}"]`);

  // if it's outside viewport, scroll to it
  const { top, bottom } = element.getBoundingClientRect();
  if (bottom > window.innerHeight || top < 0) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
