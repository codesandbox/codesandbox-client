import React from 'react';
import TerminalIcon from 'react-icons/lib/go/terminal';
import UploadIcon from 'react-icons/lib/go/cloud-upload';
import { ImportChoice, ImportChoices, ImportWizardContainer } from './elements';

import { GitHubImport, StackbitImport } from './Imports';

interface Props {
  username: string;
}

export const ImportTab = ({ username }: Props) => (
  <>
    <ImportWizardContainer>
      <GitHubImport />
      {username && <StackbitImport username={username} />}
    </ImportWizardContainer>
    <ImportChoices>
      <ImportChoice href="/docs/importing#export-with-cli">
        <TerminalIcon /> CLI Documentation
      </ImportChoice>
      <ImportChoice href="/docs/importing#define-api">
        <UploadIcon /> API Documentation
      </ImportChoice>
    </ImportChoices>
  </>
);
