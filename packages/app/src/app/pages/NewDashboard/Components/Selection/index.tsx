import React from 'react';

const Context = React.createContext({
  selectedIds: null,
  onClick: (event: React.MouseEvent<HTMLDivElement>, sandboxId: string) => {},
  onBlur: (event: React.FocusEvent<HTMLDivElement>) => {},
});

export const SelectionProvider = props => {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const onClick = (
    event: React.MouseEvent<HTMLDivElement>,
    sandboxId: string
  ) => {
    if (event.ctrlKey || event.metaKey) {
      // select multiple with modifier

      setSelectedIds([...selectedIds, sandboxId]);
    } else {
      setSelectedIds([sandboxId]);
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // TODO: This doesn't work because blur events dont get modifier keys
    // @ts-ignore i'll fix it, thanks!
    if (event.ctrlKey || event.metaKey) {
      // do nothing, another sandbox was selected
    } else {
      // reset selection
      setSelectedIds([]);
    }
  };

  return (
    <Context.Provider value={{ selectedIds, onClick, onBlur }}>
      <div style={{ position: 'relative' }}>{props.children}</div>
    </Context.Provider>
  );
};

export const useSelection = () => {
  const { selectedIds, onClick, onBlur } = React.useContext(Context);
  return { selectedIds, onClick, onBlur };
};
