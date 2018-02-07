import React from 'react';
import { inject } from 'mobx-react';
import SearchDependencies from 'app/pages/Sandbox/SearchDependencies';

function SearchDependenciesModal({ signals }) {
  return (
    <SearchDependencies
      onConfirm={(name, version) =>
        signals.editor.addNpmDependency({ name, version })
      }
    />
  );
}

export default inject('signals')(SearchDependenciesModal);
