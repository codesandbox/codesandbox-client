import React from 'react';
import { inject, observer } from 'mobx-react';

import Project from '../../Project';
import SandboxActions from '../../SandboxActions';

const ProjectInfo = () => (
  <div>
    <Project editable />

    <SandboxActions />
  </div>
);

export default inject('signals', 'store')(observer(ProjectInfo));
