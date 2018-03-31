import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';
import { sortBy } from 'lodash';
import validateTitle from '../validateTitle';
import ModuleEntry from './ModuleEntry';
import DirectoryEntry from '../';

type Props = WithCerebral & {
    depth: number;
    renameModule: (id: string, title: string) => void;
    setCurrentModule: (id: string) => void;
    parentShortid: string;
    deleteEntry: (id: string, title: string) => void;
    markTabsNotDirty: () => void;
};

class DirectoryChildren extends React.Component<Props> {
    validateTitle = (id, title) => {
        return !!validateTitle(id, title);
    };

    render() {
        const {
            depth = 0,
            renameModule,
            setCurrentModule,
            parentShortid,
            deleteEntry,
            markTabsNotDirty,
            store
        } = this.props;

        const { modules, directories } = store.editor.currentSandbox;

        return (
            <div>
                {sortBy(directories, 'title')
                    .filter((x) => x.directoryShortid === parentShortid)
                    .map((dir) => <DirectoryEntry key={dir.id} depth={depth + 1} id={dir.id} shortid={dir.shortid} />)}
                {sortBy(modules.filter((x) => x.directoryShortid === parentShortid), 'title').map((m) => (
                    <ModuleEntry
                        key={m.id}
                        module={m}
                        depth={depth}
                        setCurrentModule={setCurrentModule}
                        markTabsNotDirty={markTabsNotDirty}
                        renameModule={renameModule}
                        deleteEntry={deleteEntry}
                    />
                ))}
            </div>
        );
    }
}

export default connect<Props>()(DirectoryChildren);
