import * as React from 'react';

import Project from '../../Project';
import Files from '../../Files';
import Dependencies from '../../Dependencies';
import WorkspaceItem from '../../WorkspaceItem';

export default () => (
    <div style={{ marginTop: '1rem' }}>
        <Project />

        <Files />
        <WorkspaceItem defaultOpen title="Dependencies">
            <Dependencies />
        </WorkspaceItem>
    </div>
);
