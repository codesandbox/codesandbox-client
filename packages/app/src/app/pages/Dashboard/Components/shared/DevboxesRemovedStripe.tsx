import { MessageStripe } from '@codesandbox/components';
import React from 'react';

export const DevboxesRemovedStripe: React.FC = () => {
  return (
    <MessageStripe justify="space-between" variant="warning">
      Devboxes have been removed and are no longer available in the dashboard.
      <MessageStripe.Action
        as="a"
        href="https://codesandbox.io/docs"
        target="_blank"
        rel="noreferrer noopener"
      >
        Learn more
      </MessageStripe.Action>
    </MessageStripe>
  );
};
