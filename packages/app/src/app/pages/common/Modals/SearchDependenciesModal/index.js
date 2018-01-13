import React from 'react';
import { inject } from 'mobx-react';
import SearchDependencies from 'app/pages/Sandbox/SearchDependencies';

function SearchDependenciesModal() {
  return (
    <SearchDependencies
      onConfirm={(name, version) =>
        signals.workspace.npmDependencyAdded({ name, version })
      }
    />
  );
}

export default inject('signals')(SearchDependenciesModal);
