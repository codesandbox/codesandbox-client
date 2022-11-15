import track from '@codesandbox/common/lib/utils/analytics';
import {
  Element,
  Link as StyledLink,
  MessageStripe,
} from '@codesandbox/components';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useSubscription } from 'app/hooks/useSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useAppState } from 'app/overmind';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const getEventName = (isEligibleForTrial: boolean) =>
  isEligibleForTrial
    ? 'Limit banner: import - Start Trial'
    : 'Limit banner: import - Upgrade';

export const MaxPublicRepos: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useSubscription();
  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();

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
        css={{
          padding: 0,
        }}
        color="#FFFFFF"
        href={checkoutURL}
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
