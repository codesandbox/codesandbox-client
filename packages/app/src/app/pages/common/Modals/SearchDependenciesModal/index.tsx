import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import SearchDependencies from 'app/pages/Sandbox/SearchDependencies';

type Props = WithCerebral;

const SearchDependenciesModal: React.SFC<Props> = ({ signals }) => {
    return <SearchDependencies onConfirm={(name, version) => signals.editor.addNpmDependency({ name, version })} />;
};

export default connect<Props>()(SearchDependenciesModal);
