import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useAppState } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Element, MessageStripe } from '@codesandbox/components';
import { Link } from 'react-router-dom';
import React from 'react';

export const MaxSandboxesBanner: React.FC = () => {
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { isEligibleForTrial, isFree } = useWorkspaceSubscription();
  const { activeTeam } = useAppState();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin && isFree ? activeTeam : undefined,
    success_path: dashboardUrls.sandboxes(activeTeam),
    cancel_path: dashboardUrls.sandboxes(activeTeam),
  });

  return (
    <Element paddingX={4} paddingY={2}>
      <MessageStripe justify="space-between">
        Free teams are limited to 20 public sandboxes. Upgrade for unlimited
        public and private sandboxes.
        {isTeamAdmin ? (
          <MessageStripe.Action
            {...(checkout.state === 'READY'
              ? {
                  as: 'a',
                  href: checkout.url,
                }
              : {
                  as: Link,
                  to: '/pro',
                })}
            onClick={() =>
              isEligibleForTrial
                ? track('Limit banner: sandboxes - Start Trial', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  })
                : track('Limit banner: sandboxes - Upgrade', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  })
            }
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
