import React from 'react';
import { inject, observer } from 'mobx-react';

// eslint-disable-next-line import/extensions
import Project from '../../Project/index.tsx';
import SandboxActions from '../../SandboxActions';

const ProjectInfo = () => (
  <div>
    <Project editable />

    <SandboxActions />
  </div>
);

export default inject('signals', 'store')(observer(ProjectInfo));
