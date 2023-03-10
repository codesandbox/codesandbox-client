import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Element, MessageStripe } from '@codesandbox/components';
import { Link } from 'react-router-dom';
import React from 'react';

export const RestrictionsBanner: React.FC = () => {
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { activeTeam } = useAppState();

  const checkout = useGetCheckoutURL({
    success_path: dashboardUrls.sandboxes(activeTeam),
    cancel_path: dashboardUrls.sandboxes(activeTeam),
  });

  let checkoutUrl: string | null = null;
  if (checkout) {
    checkoutUrl =
      checkout.state === 'READY' ? checkout.url : checkout.defaultUrl;
  }

  return (
    <Element paddingX={4} paddingY={2}>
      <MessageStripe justify="space-between">
        Free teams are limited to 20 public sandboxes. Upgrade for unlimited
        public and private sandboxes.
        {checkoutUrl ? (
          <MessageStripe.Action
            {...(checkoutUrl.startsWith('/pro')
              ? {
                  as: 'a',
                  href: checkoutUrl,
                }
              : {
                  as: Link,
                  to: '/pro',
                })}
            onClick={() => {
              if (isEligibleForTrial) {
                const event = 'Limit banner: sandboxes - Start Trial';
                track(isTeamAdmin ? event : `${event} - As non-admin`, {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              } else {
                track('Limit banner: sandboxes - Upgrade', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
              }
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
