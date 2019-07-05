import React from 'react';
import history from 'app/utils/history';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NewSandboxModal } from '../../../Dashboard/Content/CreateNewSandbox/NewSandboxModal';

export default ({ closeModal }) => (
  <NewSandboxModal
    createSandbox={template => {
      history.push(sandboxUrl({ id: template.shortid }));
      closeModal();
    }}
    closeOnCreate
    width={925}
  />
);
