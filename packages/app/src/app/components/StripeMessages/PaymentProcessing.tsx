import React from 'react';
import { MessageStripe } from '@codesandbox/components';
import styled from 'styled-components';

const UnstyledLink = styled.a`
  color: inherit;
`;

export const PaymentProcessing = () => (
  <MessageStripe variant="warning">
    <span>
      Your payment is not yet processed, please wait a few seconds. If this
      banner does not disappear please{' '}
      <UnstyledLink href="mailto:support@codesandbox.io">
        contact support
      </UnstyledLink>
      .
    </span>
  </MessageStripe>
);
