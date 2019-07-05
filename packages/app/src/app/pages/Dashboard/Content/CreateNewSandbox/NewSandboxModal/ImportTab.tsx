import React from 'react';
import TerminalIcon from 'react-icons/lib/go/terminal';
import UploadIcon from 'react-icons/lib/go/cloud-upload';
import GithubPage from 'app/pages/GitHub/main';
import { ImportChoice, ImportChoices } from './elements';

export const ImportTab = () => (
  <>
    <GithubPage />
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
