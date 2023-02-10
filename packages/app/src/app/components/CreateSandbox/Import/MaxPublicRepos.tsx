import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getEventName } from './utils';

export const MaxPublicRepos: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { pathname } = useLocation();
  const { modals } = useActions();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin ? activeTeam : undefined,
    success_path: pathname,
    cancel_path: pathname,
  });

  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free repositories. Upgrade for
      more.
      {isTeamAdmin ? (
        <MessageStripe.Action
          {...(checkout.state === 'READY'
            ? {
                as: 'a',
                href: checkout.url,
              }
            : {
                as: RouterLink,
                to: '/pro',
              })}
          onClick={() => {
            // If we don't have a checkout URL, we
            // default to `/pro` which uses a link
            // from react router so we have to
            // imperatively close the modal.
            if (checkout.state !== 'READY') {
              modals.newSandboxModal.close();
            }

            track(getEventName(isEligibleForTrial), {
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
          href={
            isEligibleForTrial
              ? SUBSCRIPTION_DOCS_URLS.teams.trial
              : SUBSCRIPTION_DOCS_URLS.teams.non_trial
          }
          target="_blank"
        >
          Learn more
        </MessageStripe.Action>
      )}
    </MessageStripe>
  );
};
