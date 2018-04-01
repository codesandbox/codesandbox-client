import * as React from 'react';
import { DeleteSandboxButton } from './elements';

type Props = {
    id: string;
    onDelete: (id: string) => void;
};

export default class DeleteSandboxButtonContainer extends React.PureComponent<Props> {
    deleteSandbox = () => {
        this.props.onDelete(this.props.id);
    };

    render() {
        return <DeleteSandboxButton onClick={this.deleteSandbox} />;
    }
}
