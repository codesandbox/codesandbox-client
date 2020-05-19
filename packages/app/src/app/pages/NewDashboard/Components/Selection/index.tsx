import React from 'react';

const Context = React.createContext({
  selectedId: null,
  onClick: (event, sandboxId) => {},
  onBlur: event => {},
});

export const SelectionProvider = props => {
  const [selectedId, setSelectedId] = React.useState(null);

  const onBlur = event => {
    setSelectedId(null);
  };

  const onClick = (event, sandboxId) => {
    setSelectedId(sandboxId);
  };

  return (
    <Context.Provider value={{ selectedId, onClick, onBlur }}>
      <div style={{ position: 'relative' }}>{props.children}</div>
    </Context.Provider>
  );
};

export const useSelection = () => {
  const { selectedId, onClick, onBlur } = React.useContext(Context);
  return { selectedId, onClick, onBlur };
};
