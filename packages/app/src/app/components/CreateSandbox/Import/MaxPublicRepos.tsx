import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import { getEventName } from './utils';

const EVENT_PROPS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const MaxPublicRepos: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { pathname } = useLocation();
  const { activeTeam } = useAppState();

  const [, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free repositories. Upgrade for
      more.
      {canCheckout ? (
        <MessageStripe.Action
          onClick={() => {
            createCheckout({
              success_path: pathname,
              cancel_path: pathname,
              team_id: activeTeam,
              recurring_interval: 'year',
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
