import track from '@codesandbox/common/lib/utils/analytics';
import { Link as StyledLink } from '@codesandbox/components';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions } from 'app/overmind';
import React from 'react';
import { getEventName } from './utils';

export const PrivateRepoFreeTeam: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isBillingManager } = useWorkspaceAuthorization();
  const { modalClosed } = useActions();

  const [, createCheckout, canCheckout] = useCreateCheckout();

  const ctaURL = ((): string | null => {
    if (!canCheckout) {
      return '/docs/learn/plans/workspace#managing-teams-and-subscriptions';
    }

    return null;
  })();

  return (
    <>
      The free plan only allows public repos. For private repositories,{' '}
      <StyledLink
        {...(ctaURL
          ? {
              as: 'a',
              to: ctaURL,
            }
          : {})}
        css={{
          padding: 0,
        }}
        color="#FFFFFF"
        onClick={() => {
          if (ctaURL) {
            modalClosed();
          } else {
            createCheckout({
              trackingLocation: 'dashboard_import_limits',
            });
          }

          track(getEventName(isEligibleForTrial, isBillingManager), {
            codesandbox: 'V1',
            event_source: 'UI',
          });
        }}
      >
        upgrade to Pro.
      </StyledLink>
    </>
  );
};
