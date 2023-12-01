import React from 'react';
import { Stack, Text } from '@codesandbox/components';

export const UBBWaitlist = () => (
  <Stack
    direction="horizontal"
    css={{
      margin: 'auto',
      padding: '24px 32px',
      alignItems: 'center',
      maxWidth: '976px',
      background: '#DCF76E',
      color: '#0E0E0E',
    }}
    gap={4}
  >
    <Stack direction="vertical" gap={2}>
      <Text size={6} fontFamily="everett">
        Pay only for what you use
      </Text>
      <Text>
        We&apos;re transitioning to a usage-based billing model, where you can
        have as many contributors as you want, and only pay for the resources
        you use. Be among the first to help us fine-tune our model by becoming a
        beta tester!
      </Text>
    </Stack>
    <Text
      css={{
        display: 'block',
        background: '#0E0E0E',
        color: '#fff',
        padding: '16px 20px',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        borderRadius: '4px',
        transition: 'background .3s',
        '&:hover': {
          background: '#252525',
        },
      }}
      as="a"
      target="_blank"
      rel="noreferrer noopener"
      href="https://codesandbox.typeform.com/to/Y7gfpCiA"
    >
      Sign up for the beta
    </Text>
  </Stack>
);
