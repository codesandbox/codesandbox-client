import React, { FunctionComponent } from 'react';
import { useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const BranchCreationDeprecatedModal: FunctionComponent = () => {
  const { modalClosed } = useActions();

  return (
    <Alert
      title="Branch creation is deprecated"
      description={
        <>
          The repositories product will be removed on July 15th. Make sure to
          commit and push any work on your branches before then.{' '}
          <a
            href="https://codesandbox.io/docs/learn/repositories/migration-guide"
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: '#E4FC82' }}
          >
            Visit our documentation for migration options.
          </a>
        </>
      }
      confirmMessage="Close"
      type="secondary"
      onPrimaryAction={modalClosed}
    />
  );
};
