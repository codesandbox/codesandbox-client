import * as React from 'react';

import Project from '../../Project';
import SandboxActions from '../../SandboxActions';

export default () => (
    <div>
        <Project editable />
        <SandboxActions />
    </div>
);
