import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { getEventName } from './utils';

const EVENT_PROPS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const MaxPublicRepos: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { pathname } = useLocation();

  const [, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free repositories. Upgrade for
      more.
      {canCheckout ? (
        <MessageStripe.Action
          onClick={() => {
            createCheckout({
              cancel_path: pathname,
              recurring_interval: 'year',
              utm_source: 'max_public_repos',
            });

            track(
              getEventName(isEligibleForTrial, isBillingManager),
              EVENT_PROPS
            );
          }}
        >
          {isEligibleForTrial ? 'Start trial' : 'Upgrade now'}
        </MessageStripe.Action>
      ) : (
        <MessageStripe.Action
          as="a"
          href={
            isEligibleForTrial
              ? SUBSCRIPTION_DOCS_URLS.teams.trial
              : SUBSCRIPTION_DOCS_URLS.teams.non_trial
          }
          target="_blank"
          onClick={() =>
            track('Limit banner: create sandbox - Learn more', EVENT_PROPS)
          }
        >
          Learn more
        </MessageStripe.Action>
      )}
    </MessageStripe>
  );
};
