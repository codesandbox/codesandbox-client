import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useGetCheckoutURL } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getEventName } from './utils';

const EVENT_PROPS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

export const MaxPublicRepos: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { pathname } = useLocation();

  const checkoutUrl = useGetCheckoutURL({
    success_path: pathname,
    cancel_path: pathname,
  });

  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free repositories. Upgrade for
      more.
      {checkoutUrl ? (
        <MessageStripe.Action
          {...(checkoutUrl.startsWith('/pro')
            ? {
                as: RouterLink,
                to: '/pro',
              }
            : {
                as: 'a',
                href: checkoutUrl,
              })}
          onClick={() => {
            track(getEventName(isEligibleForTrial, isTeamAdmin), EVENT_PROPS);
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
