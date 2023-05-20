import { MessageStripe, Link } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useGetCheckoutURL } from 'app/hooks';
import { useAppState } from 'app/overmind';

const getEventName = (
  isEligibleForTrial: boolean,
  isBillingManager: boolean
) => {
  if (isEligibleForTrial) {
    const event = 'Limit banner: repos - Start Trial';
    return isBillingManager ? event : `${event} - As non-admin`;
  }
  return 'Limit banner: repos - Upgrade';
};

export const PrivateRepoFreeTeam: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isBillingManager, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();

  const checkoutUrl = useGetCheckoutURL({
    success_path: pathname,
    cancel_path: pathname,
  });

  const ctaUrl = `${
    isPersonalSpace ? '/pro' : checkoutUrl
  }?utm_source=dashboard_private_repo_upgrade`;

  return (
    <MessageStripe
      justify={ctaUrl ? 'space-between' : 'center'}
      variant="trial"
    >
      This repository is in view mode only. Upgrade your account for unlimited
      repositories.
      {checkoutUrl && (
        <MessageStripe.Action
          {...(checkoutUrl.startsWith('/')
            ? {
                as: RouterLink,
                to: ctaUrl,
              }
            : {
                as: 'a',
                href: ctaUrl,
              })}
          onClick={() => {
            track(getEventName(isEligibleForTrial, isBillingManager), {
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

export const MaxReposFreeTeam: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();

  const checkoutUrl = useGetCheckoutURL({
    success_path: dashboardUrls.repositories(activeTeam),
    cancel_path: dashboardUrls.repositories(activeTeam),
  });

  return (
    <MessageStripe justify="space-between" variant="trial">
      Free teams are limited to 3 public repositories. Upgrade for unlimited
      public and private repositories.
      {checkoutUrl ? (
        <MessageStripe.Action
          {...(checkoutUrl.startsWith('/')
            ? {
                as: Link,
                to: checkoutUrl,
              }
            : {
                as: 'a',
                href: checkoutUrl,
              })}
          onClick={() =>
            track(getEventName(isEligibleForTrial, isBillingManager), {
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
