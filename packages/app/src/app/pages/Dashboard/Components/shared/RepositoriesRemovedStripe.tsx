import { MessageStripe } from '@codesandbox/components';
import React from 'react';

export const RepositoriesRemovedStripe: React.FC = () => {
  return (
    <MessageStripe justify="space-between" variant="warning">
      The repositories product has been removed since July 15th and is no longer
      available in the dashboard.
      <MessageStripe.Action
        as="a"
        href="https://codesandbox.io/docs/learn/repositories/migration-guide"
        target="_blank"
        rel="noreferrer noopener"
      >
        Migration guide
      </MessageStripe.Action>
    </MessageStripe>
  );
};
