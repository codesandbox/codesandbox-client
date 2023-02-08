import track from '@codesandbox/common/lib/utils/analytics';
import { Element, Link as StyledLink } from '@codesandbox/components';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getEventName } from './utils';

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
