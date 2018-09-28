import React from 'react';
import history from 'app/utils/history';
import { sandboxUrl } from 'common/utils/url-generator';

import NewSandboxModal from '../../../Dashboard/Content/CreateNewSandbox/Modal';

export default () => (
  <NewSandboxModal
    createSandbox={template => {
      history.push(sandboxUrl({ id: template.shortid }));
    }}
    width={925}
  />
);
