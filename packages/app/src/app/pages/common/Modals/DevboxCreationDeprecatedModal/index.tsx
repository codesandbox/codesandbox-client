import React, { FunctionComponent } from 'react';
import { useActions } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const DevboxCreationDeprecatedModal: FunctionComponent = () => {
  const { modalClosed } = useActions();

  return (
    <Alert
      title="Devboxes are being deprecated"
      description={
        <>
          Creating and forking Devboxes is being deprecated and will be removed
          soon. Make sure to export or migrate any work you want to keep before
          then.{' '}
          <a
            href="https://codesandbox.io/docs/learn/vm-sandboxes/overview"
            target="_blank"
            rel="noreferrer noopener"
            style={{ color: '#E4FC82' }}
          >
            Learn more.
          </a>
        </>
      }
      confirmMessage="Close"
      type="secondary"
      onPrimaryAction={modalClosed}
    />
  );
};
