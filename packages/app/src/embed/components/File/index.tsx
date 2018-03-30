import * as React from 'react';
import { EntryContainer as Entry } from 'app/pages/Sandbox/Editor/Workspace/elements';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import EntryTitle from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryTitle';

import { LeftOffset } from './elements';

type Props = {
    id: string;
    setCurrentModule: (id: string) => void;
    title: string;
    depth: number;
    type: string;
    active?: boolean;
    alternative?: boolean;
    shortid?: string;
};

export default class File extends React.PureComponent<Props> {
    static defaultProps = {
        active: false,
        alternative: false
    };

    setCurrentModule = () => {
        const { id, setCurrentModule } = this.props;

        setCurrentModule(id);
    };

    render() {
        const { title, depth, type, active, alternative } = this.props;
        return (
            <div>
                <Entry alternative={alternative} active={active} onClick={this.setCurrentModule} type={type}>
                    <LeftOffset depth={depth}>
                        <EntryIcons type={type} />
                        <EntryTitle title={title} />
                    </LeftOffset>
                </Entry>
            </div>
        );
    }
}
