import React from 'react';
import { useOvermind } from 'app/overmind';
import SearchDependencies from 'app/pages/Sandbox/SearchDependencies';

export const SearchDependenciesModal: React.FC = () => {
  const {
    actions: {
      editor: { addNpmDependency },
    },
  } = useOvermind();
  return (
    <SearchDependencies
      onConfirm={(name, version) => addNpmDependency({ name, version })}
    />
  );
};

