import React from 'react';
import TerminalIcon from 'react-icons/lib/go/terminal';
import UploadIcon from 'react-icons/lib/go/cloud-upload';
import GithubPage from 'app/pages/GitHub/main';

import { ImportChoice, ImportChoices } from './elements';

export default () => (
  <>
    <GithubPage noConverted />
    <ImportChoices>
      <ImportChoice href="/docs/importing#export-with-cli" target="_blank">
        <TerminalIcon /> CLI Documentation
      </ImportChoice>
      <ImportChoice href="/docs/importing#define-api" target="_blank">
        <UploadIcon /> API Documentation
      </ImportChoice>
    </ImportChoices>
  </>
);
