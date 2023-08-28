import track from '@codesandbox/common/lib/utils/analytics';
import { Element, Link as StyledLink } from '@codesandbox/components';
import { useCreateCheckout } from 'app/hooks';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions } from 'app/overmind';
import React from 'react';
import { getEventName } from './utils';

export const PrivateRepoFreeTeam: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isBillingManager, isPersonalSpace } = useWorkspaceAuthorization();
  const { modals } = useActions();

  const [, createCheckout, canCheckout] = useCreateCheckout();

  /**
   * Is pro?: '/pro'
   * Can checkout? createCheckout
   * Can't checkout? '/docs/learn/introduction/workspace#managing-teams-and-subscriptions'
   */

  const ctaURL = ((): string | false => {
    if (!canCheckout) {
      return isPersonalSpace
        ? '/pro'
        : '/docs/learn/plans/workspace#managing-teams-and-subscriptions';
    }

    return false;
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
            modals.newSandboxModal.close();
          } else {
            createCheckout({
              utm_source: 'dashboard_import_limits',
            });
          }

          track(getEventName(isEligibleForTrial, isBillingManager), {
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
