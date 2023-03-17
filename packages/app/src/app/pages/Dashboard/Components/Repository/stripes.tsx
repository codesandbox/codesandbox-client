import { MessageStripe, Link, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useGetCheckoutURL } from 'app/hooks';
import { useAppState } from 'app/overmind';

const getEventName = (isEligibleForTrial: boolean, isAdmin: boolean) => {
  if (isEligibleForTrial) {
    const event = 'Limit banner: repos - Start Trial';
    return isAdmin ? event : `${event} - As non-admin`;
  }
  return 'Limit banner: repos - Upgrade';
};

export const PrivateRepoFreeTeam: React.FC = () => {
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const { pathname } = useLocation();

  const checkoutUrl = useGetCheckoutURL({
    success_path: pathname,
    cancel_path: pathname,
  });

  const ctaURl = `${
    isPersonalSpace ? '/pro' : checkoutUrl
  }?utm_source=dashboard_private_repo_upgrade`;

  return (
    <MessageStripe
      justify={ctaURl ? 'space-between' : 'center'}
      variant="trial"
    >
      This repository is in view mode only. Upgrade your account for unlimited
      repositories.
      {checkoutUrl && (
        <MessageStripe.Action
          {...(checkoutUrl.startsWith('/')
            ? {
                as: RouterLink,
                to: ctaURl,
              }
            : {
                as: 'a',
                href: ctaURl,
              })}
          onClick={() => {
            track(getEventName(isEligibleForTrial, isAdmin), {
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

export const MaxReposFreeTeam: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isEligibleForTrial } = useWorkspaceSubscription();
  const { isAdmin } = useWorkspaceAuthorization();

  const checkoutUrl = useGetCheckoutURL({
    success_path: dashboardUrls.repositories(activeTeam),
    cancel_path: dashboardUrls.repositories(activeTeam),
  });

  return (
    <MessageStripe justify="space-between" variant="trial">
      Free teams are limited to 3 public repositories. Upgrade for unlimited
      public and private repositories.
      {checkoutUrl ? (
        <MessageStripe.Action
          {...(checkoutUrl.startsWith('/')
            ? {
                as: Link,
                to: '/pro',
              }
            : {
                as: 'a',
                href: checkoutUrl,
              })}
          onClick={() =>
            track(getEventName(isEligibleForTrial, isAdmin), {
              codesandbox: 'V1',
              event_source: 'UI',
            })
          }
        >
          {isEligibleForTrial ? 'Start trial' : 'Upgrade now'}
        </MessageStripe.Action>
      ) : (
        <MessageStripe.Action
          as="a"
          href="https://codesandbox.io/docs/learn/plan-billing/trials"
          onClick={() => {
            track('Limit banner: repos - Learn More', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
          }}
          variant="trial"
        >
          Learn more
        </MessageStripe.Action>
      )}
    </MessageStripe>
  );
};

export const TemporaryWarningForWorkspaceScopesMigration: React.FC<{
  onDismiss?: () => void;
  variant?: 'repository' | 'branch';
}> = ({ onDismiss, variant = 'repository' }) => {
  return (
    <MessageStripe
      justify="space-between"
      onDismiss={onDismiss}
      variant="neutral"
    >
      <Text>
        Can&apos;t find a {variant}? It is not deleted, but needs to be
        re-imported due to a change. Please{' '}
        <Link
          css={{ textDecoration: 'underline', fontWeight: 'bold' }}
          href="https://www.loom.com/share/a7a7a44e7ef547358ab5696d6d328156"
        >
          watch this video for more details
        </Link>
        .
      </Text>
    </MessageStripe>
  );
};
