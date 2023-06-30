import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Element, MessageStripe } from '@codesandbox/components';
import React from 'react';

export const SandboxesRestrictionsBanner: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <Element paddingX={4} paddingY={2}>
      <MessageStripe justify="space-between">
        Free teams are limited to 20 public sandboxes. Upgrade for unlimited
        public and private sandboxes.
        {canCheckout ? (
          <MessageStripe.Action
            disabled={checkout.status === 'loading'}
            onClick={() => {
              if (isEligibleForTrial) {
                const event = 'Limit banner: sandboxes - Start Trial';
                track(isBillingManager ? event : `${event} - As non-admin`, {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              } else {
                track('Limit banner: sandboxes - Upgrade', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              }

              createCheckout({
                utm_source: 'restrictions_banner',
                cancel_path: dashboardUrls.sandboxes(activeTeam),
              });
            }}
          >
            {isEligibleForTrial ? 'Start free trial' : 'Upgrade now'}
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
