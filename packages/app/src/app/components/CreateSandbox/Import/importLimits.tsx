import track from '@codesandbox/common/lib/utils/analytics';
import {
  Element,
  Link as StyledLink,
  MessageStripe,
} from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const getEventName = (
  isEligibleForTrial: boolean,
  isTeamAdmin?: boolean
): string => {
  if (isTeamAdmin) {
    return isEligibleForTrial
      ? 'Limit banner: import - Start Trial'
      : 'Limit banner: import - Upgrade';
  }

  return 'Limit banner: import - Learn more';
};

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

export const PrivateRepoFreeTeam: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();
  const { modals } = useActions();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin || isPersonalSpace ? activeTeam : undefined,
    success_path: pathname,
    cancel_path: pathname,
  });

  let checkoutURL: string;

  if (isTeamAdmin || isPersonalSpace) {
    if (checkout.state === 'READY') {
      checkoutURL = checkout.url;
    } else {
      checkoutURL = '/pro';
    }
  } else {
    // Not team admin or personal workspace points to docs
    checkoutURL = isEligibleForTrial
      ? '/docs/learn/plan-billing/trials'
      : '/docs/learn/introduction/workspace#managing-teams-and-subscriptions';
  }

  const isDashboardLink = checkoutURL.startsWith('/pro');

  return (
    <>
      The free plan only allows public repos. For private repositories,{' '}
      <StyledLink
        {...(isDashboardLink
          ? {
              as: RouterLink,
              to: `${checkoutURL}?utm_source=dashboard_import_limits`,
            }
          : {
              as: 'a',
              href: checkoutURL, // goes to either /docs or Stripe
            })}
        css={{
          padding: 0,
        }}
        color="#FFFFFF"
        onClick={() => {
          if (isDashboardLink) {
            modals.newSandboxModal.close();
          }

          track(getEventName(isEligibleForTrial, isTeamAdmin), {
            codesandbox: 'V1',
            event_source: 'UI',
          });
        }}
      >
        upgrade to{' '}
        <Element as="span" css={{ textTransform: 'uppercase' }}>
          pro
        </Element>
        .
      </StyledLink>
    </>
  );
};

export const UnauthorizedGitHub = () => {
  return (
    <MessageStripe justify="space-between" variant="warning">
      Adjust your GitHub App permissions to have full access to your
      repositories.
      <MessageStripe.Action onClick={() => alert('foo')}>
        Review GH permissions
      </MessageStripe.Action>
    </MessageStripe>
  );
};
