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

      setSelectedIds([...selectedIds, sandboxId]);
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
