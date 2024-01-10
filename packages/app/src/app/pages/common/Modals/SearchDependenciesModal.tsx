import React, { FunctionComponent } from 'react';

import { useActions } from 'app/overmind';
import { SearchDependencies } from 'app/pages/Sandbox/SearchDependencies';

export const SearchDependenciesModal: FunctionComponent = () => {
  const { addNpmDependency } = useActions().editor;

  return (
    <SearchDependencies
      onConfirm={(name: string, version: string) =>
        addNpmDependency({ name, version })
      }
    />
  );
};
