import * as React from 'react';
import Alert from 'app/components/Alert';
import { connect, WithCerebral } from 'app/fluent';

const DeleteSandboxModal: React.SFC<WithCerebral> = ({ signals }) => {
    return (
        <Alert
            title="Delete Sandbox"
            body={<span>Are you sure you want to delete this sandbox?</span>}
            onCancel={() => signals.modalClosed()}
            onDelete={() => signals.workspace.sandboxDeleted()}
        />
    );
};

export default connect()(DeleteSandboxModal);
