import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import { SearchDependencies } from 'app/pages/Sandbox/SearchDependencies';

export const SearchDependenciesModal: FunctionComponent = () => {
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
