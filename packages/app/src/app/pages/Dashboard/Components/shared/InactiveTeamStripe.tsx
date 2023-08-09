import { useCreateCheckout } from 'app/hooks';

import track from '@codesandbox/common/lib/utils/analytics';
import { Element, MessageStripe } from '@codesandbox/components';
import React from 'react';

export const InactiveTeamStripe: React.FC = ({ children }) => {
  const [checkout, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <Element paddingX={4} paddingY={2}>
      <MessageStripe justify="space-between">
        {children}
        {canCheckout ? (
          <MessageStripe.Action
            disabled={checkout.status === 'loading'}
            onClick={() => {
              track('Limit banner: sandboxes - Upgrade', {
                codesandbox: 'V1',
                event_source: 'UI',
              });

              createCheckout({
                utm_source: 'restrictions_banner',
              });
            }}
          >
            Upgrade now
          </MessageStripe.Action>
        ) : (
          <MessageStripe.Action
            as="a"
            href="https://codesandbox.io/docs/learn/plan-billing/trials"
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              track('Limit banner: sandboxes - Learn More', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
            }}
          >
            Learn more
          </MessageStripe.Action>
        )}
      </MessageStripe>
    </Element>
  );
};
