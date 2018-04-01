import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import SearchDependencies from 'app/pages/Sandbox/SearchDependencies';

const SearchDependenciesModal: React.SFC<WithCerebral> = ({ signals }) => {
    return <SearchDependencies onConfirm={(name, version) => signals.editor.addNpmDependency({ name, version })} />;
};

export default connect()(SearchDependenciesModal);
