import { MessageStripe } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { useCreateCheckout } from 'app/hooks';

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
                trackingLocation: 'dashboard_private_repo_upgrade',
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
              trackingLocation: 'dashboard_private_repo_upgrade',
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
          href="https://codesandbox.io/docs/learn/plans/trials"
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
