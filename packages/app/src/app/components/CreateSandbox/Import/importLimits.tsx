import track from '@codesandbox/common/lib/utils/analytics';
import {
  Element,
  Link as StyledLink,
  MessageStripe,
} from '@codesandbox/components';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useSubscription } from 'app/hooks/useSubscription';
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
  const { isEligibleForTrial } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();
  const { modals } = useActions();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin || isPersonalSpace ? activeTeam : undefined,
    success_path: pathname,
    cancel_path: pathname,
  });

  return (
    <MessageStripe justify={isTeamAdmin ? 'space-between' : 'center'}>
      You&apos;ve reached the maximum amount of free repositories. Upgrade for
      more.
      {isTeamAdmin && (
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
      )}
    </MessageStripe>
  );
};

export const PrivateRepoFreeTeam: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();
  const { modals } = useActions();

  const checkout = useGetCheckoutURL({
    team_id: isTeamAdmin || isPersonalSpace ? activeTeam : undefined,
    success_path: pathname,
    cancel_path: pathname,
  });

  const checkoutURL = React.useMemo(() => {
    if (isTeamAdmin || isPersonalSpace) {
      if (checkout.state === 'READY') {
        return checkout.url;
      }
      return '/pro';
    }

    return isEligibleForTrial
      ? '/docs/learn/plan-billing/trials'
      : '/docs/learn/introduction/workspace#managing-teams-and-subscriptions';
  }, [checkout, isEligibleForTrial, isTeamAdmin, isPersonalSpace]);

  return (
    <>
      The free plan only allows public repos. For private repositories,{' '}
      <StyledLink
        {...(checkoutURL.startsWith('/pro')
          ? {
              as: 'a',
              href: checkoutURL,
            }
          : {
              as: RouterLink,
              to: '/pro',
            })}
        css={{
          padding: 0,
        }}
        color="#FFFFFF"
        onClick={() => {
          if (checkoutURL.startsWith('/pro')) {
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
