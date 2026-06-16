import { MessageStripe } from '@codesandbox/components';
import React from 'react';

export const RepositoryDeprecationStripe: React.FC = () => {
  return (
    <MessageStripe justify="space-between" variant="warning">
      Branch creation is deprecated and the repositories product will be removed
      on July 15th. Make sure to commit and push any work on your branches before
      then.
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
