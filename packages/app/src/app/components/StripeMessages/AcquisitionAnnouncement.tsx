import React from 'react';
import { MessageStripe, Text } from '@codesandbox/components';

export const AcquisitionAnnouncement: React.FC<{ onDismiss: () => void }> = ({
  onDismiss,
}) => (
  <MessageStripe
    justify="space-between"
    variant="primary"
    corners="straight"
    onDismiss={onDismiss}
  >
    <Text>
      CodeSandbox is now part of{' '}
      <a
        style={{ color: 'inherit' }}
        href="https://together.ai"
        rel="noreferrer"
        target="_blank"
      >
        Together AI!
      </a>{' '}
      We have joined forces to launch{' '}
      <a
        style={{ color: 'inherit' }}
        href="https://codesandbox.io/sdk"
        rel="noreferrer"
        target="_blank"
      >
        CodeSandbox SDK
      </a>{' '}
      and bring code interpretation to generative AI.
    </Text>
    <MessageStripe.Action
      as="a"
      target="_blank"
      rel="noreferrer"
      href="https://codesandbox.io/blog/joining-together-ai-introducing-codesandbox-sdk"
    >
      See full announcement
    </MessageStripe.Action>
  </MessageStripe>
);
