import * as React from 'react';
import { connect } from 'app/fluent';
import SearchDependencies from 'app/pages/Sandbox/SearchDependencies';

export default connect()
  .with(({ signals }) => ({
    addNpmDependency: signals.editor.addNpmDependency
  }))
  .to(
    function SearchDependenciesModal({ addNpmDependency }) {
      return (
        <SearchDependencies
          onConfirm={(name, version) =>
            addNpmDependency({ name, version })
          }
        />
      );
    }
  )
