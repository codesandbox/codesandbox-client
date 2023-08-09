import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { getEventName } from './utils';

const EVENT_PROPS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const InactiveTeam: React.FC = () => {
  const { isBillingManager } = useWorkspaceAuthorization();

  const [, createCheckout, canCheckout] = useCreateCheckout();

  return (
    <MessageStripe justify="space-between">
      Re-activate your workspace to import a repository.
      {canCheckout ? (
        <MessageStripe.Action
          onClick={() => {
            createCheckout({
              utm_source: 'max_public_repos',
            });

            track(getEventName(false, isBillingManager), EVENT_PROPS);
          }}
        >
          Upgrade now
        </MessageStripe.Action>
      ) : (
        <MessageStripe.Action
          as="a"
          href={SUBSCRIPTION_DOCS_URLS.teams.non_trial}
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
