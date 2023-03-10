import { useGetCheckoutURL } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Element, MessageStripe } from '@codesandbox/components';
import { Link } from 'react-router-dom';
import React from 'react';

export const RestrictionsBanner: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const checkoutUrl = useGetCheckoutURL({
    success_path: dashboardUrls.sandboxes(activeTeam),
    cancel_path: dashboardUrls.sandboxes(activeTeam),
  });

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
