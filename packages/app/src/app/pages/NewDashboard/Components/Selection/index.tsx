import React from 'react';
import { Element } from '@codesandbox/components';

const Context = React.createContext({
  selectedIds: [],
  onClick: (event: React.MouseEvent<HTMLDivElement>, sandboxId: string) => {},
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => {},
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

      const sandboxesToAdd = [];

      if (start >= 0 && end >= 0) {
        const increment = end > start ? +1 : -1;

        for (
          let index = start;
          increment > 0 ? index <= end : index >= end;
          index += increment
        ) {
          sandboxesToAdd.push(sandboxes[index].id);
        }
      } else {
        sandboxesToAdd.push(sandboxId);
      }

      setSelectedIds([...selectedIds, ...sandboxesToAdd]);
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

  return (
    <Context.Provider value={{ selectedIds, onClick, onBlur }}>
      <Element onClick={onContainerClick}>{props.children}</Element>
    </Context.Provider>
  );
};

export const useSelection = () => {
  const { selectedIds, onClick, onBlur } = React.useContext(Context);
  return { selectedIds, onClick, onBlur };
};
