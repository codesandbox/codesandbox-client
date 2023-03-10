import track from '@codesandbox/common/lib/utils/analytics';
import { Element, Link as StyledLink } from '@codesandbox/components';
import { useGetCheckoutURL } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions } from 'app/overmind';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getEventName } from './utils';

export const PrivateRepoFreeTeam: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isTeamAdmin } = useWorkspaceAuthorization();
  const { pathname } = useLocation();
  const { modals } = useActions();

  const _checkoutUrl = useGetCheckoutURL({
    success_path: pathname,
    cancel_path: pathname,
  });

  const checkoutUrl =
    _checkoutUrl ??
    '/docs/learn/introduction/workspace#managing-teams-and-subscriptions';
  const isDashboardLink = checkoutUrl.startsWith('/');

  return (
    <>
      The free plan only allows public repos. For private repositories,{' '}
      <StyledLink
        {...(isDashboardLink
          ? {
              as: RouterLink,
              to: `${checkoutUrl}?utm_source=dashboard_import_limits`,
            }
          : {
              as: 'a',
              href: checkoutUrl, // goes to either /docs or Stripe
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
