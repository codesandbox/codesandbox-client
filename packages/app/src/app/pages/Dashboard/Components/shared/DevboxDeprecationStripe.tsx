import { MessageStripe } from '@codesandbox/components';
import React from 'react';

export const DevboxDeprecationStripe: React.FC = () => {
  return (
    <MessageStripe justify="space-between" variant="warning">
      Devboxes are being deprecated and will be removed soon. Make sure to
      export or migrate any work you want to keep before then.
      <MessageStripe.Action
        as="a"
        href="https://codesandbox.io/docs/learn/vm-sandboxes/overview"
        target="_blank"
        rel="noreferrer noopener"
      >
        Learn more
      </MessageStripe.Action>
    </MessageStripe>
  );
};
