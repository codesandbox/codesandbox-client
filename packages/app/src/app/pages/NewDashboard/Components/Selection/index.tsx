import React from 'react';
import { Element } from '@codesandbox/components';
import {
  ARROW_LEFT,
  ARROW_RIGHT,
} from '@codesandbox/common/lib/utils/keycodes';

const Context = React.createContext({
  selectedIds: [],
  onClick: (event: React.MouseEvent<HTMLDivElement>, sandboxId: string) => {},
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => {},
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {},
});

export const SelectionProvider = ({ sandboxes = [], ...props }) => {
  const [selectedIds, setSelectedIds] = React.useState([]);

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

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!selectedIds.length) return;
    if (event.keyCode !== ARROW_RIGHT && event.keyCode !== ARROW_LEFT) return;

    const lastSelectedSandboxId = selectedIds[selectedIds.length - 1];

    const index = sandboxes.findIndex(
      sandbox => sandbox.id === lastSelectedSandboxId
    );

    const direction = event.keyCode === ARROW_RIGHT ? 'forward' : 'backward';
    const nextSandbox = sandboxes[index + (direction === 'forward' ? 1 : -1)];

    // boundary conditions
    if (!nextSandbox) return;

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

  return (
    <Context.Provider value={{ selectedIds, onClick, onBlur, onKeyDown }}>
      <Element onClick={onContainerClick}>{props.children}</Element>
    </Context.Provider>
  );
};

export const useSelection = () => {
  const { selectedIds, onClick, onBlur, onKeyDown } = React.useContext(Context);
  return { selectedIds, onClick, onBlur, onKeyDown };
};
