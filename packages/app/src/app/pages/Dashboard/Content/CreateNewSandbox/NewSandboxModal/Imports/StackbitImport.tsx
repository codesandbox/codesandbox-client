import React from 'react';
import { ImportHeader, ImportDescription, Section } from './elements';
import { StackbitButton } from './StackbitButton';

interface Props {
  username: string;
}

export const StackbitImport = ({ username }: Props) => (
  <Section style={{ flex: 4 }}>
    <ImportHeader>Import from Stackbit</ImportHeader>
    <ImportDescription>
      Create a project using{' '}
      <a href="https://stackbit.com" target="_blank" rel="noreferrer noopener">
        Stackbit
      </a>
      . This generates a project for you that's automatically set up with any
      Theme, Site Generator and CMS.
      <StackbitButton
        style={{ marginTop: '1rem', float: 'right' }}
        username={username}
      />
    </ImportDescription>
  </Section>
);
