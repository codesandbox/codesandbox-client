import { MessageStripe } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCreateCheckout } from 'app/hooks';
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

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <MessageStripe justify="space-between" variant="trial">
      This repository is in view mode only. Upgrade your account for unlimited
      repositories.
      {canCheckout && (
        <MessageStripe.Action
          disabled={checkout.status === 'loading'}
          onClick={() => {
            track(getEventName(isEligibleForTrial, isBillingManager), {
              codesandbox: 'V1',
              event_source: 'UI',
            });

            if (isPersonalSpace) {
              window.location.href = '/pro';
            } else {
              createCheckout({
                cancel_path: pathname,
                utm_source: 'dashboard_private_repo_upgrade',
              });
            }
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

  const [checkout, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <MessageStripe justify="space-between" variant="trial">
      Free teams are limited to 3 public repositories. Upgrade for unlimited
      public and private repositories.
      {canCheckout ? (
        <MessageStripe.Action
          disabled={checkout.status === 'loading'}
          onClick={() => {
            createCheckout({
              cancel_path: dashboardUrls.repositories(activeTeam),
              utm_source: 'dashboard_private_repo_upgrade',
            });

            track(getEventName(isEligibleForTrial, isBillingManager), {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
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
