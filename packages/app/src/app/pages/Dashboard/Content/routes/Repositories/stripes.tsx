import { MessageStripe } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useSubscription } from 'app/hooks/useSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useAppState } from 'app/overmind';

const getEventName = (isEligibleForTrial: boolean) =>
  isEligibleForTrial
    ? 'Limit banner: repos - Start Trial'
    : 'Limit banner: repos - Upgrade';

export const PrivateRepoFreeTeam: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin || isPersonalSpace ? activeTeam : undefined,
    success_path: pathname,
    cancel_path: pathname,
  });

  return (
    <MessageStripe
      justify={isTeamAdmin ? 'space-between' : 'center'}
      variant="trial"
    >
      This repository is in view mode only. Upgrade your account for unlimited
      repositories.
      {isTeamAdmin && (
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
          onClick={() => {
            track(getEventName(isEligibleForTrial), {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
        >
          {isEligibleForTrial ? 'Start trial' : 'Upgrade now'}
        </MessageStripe.Action>
      )}
    </MessageStripe>
  );
};

export const MaxPublicReposFreeTeam: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin || isPersonalSpace ? activeTeam : undefined,
    success_path: dashboardUrls.repositories(activeTeam),
    cancel_path: dashboardUrls.repositories(activeTeam),
  });

  return (
    <MessageStripe justify="space-between" variant="trial">
      Free teams are limited to 3 public repositories. Upgrade for unlimited
      repositories.
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
            track(getEventName(isEligibleForTrial), {
              codesandbox: 'V1',
              event_source: 'UI',
            })
          }
        >
          {isEligibleForTrial ? 'Start trial' : 'Upgrade now'}
        </MessageStripe.Action>
      ) : (
        <MessageStripe.Action
          as="a"
          href="https://codesandbox.io/docs/learn/plan-billing/trials"
          onClick={() => {
            track('Limit banner: repos - Learn More', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
          variant="trial"
        >
          Learn more
        </MessageStripe.Action>
      )}
    </MessageStripe>
  );
};
