import React from 'react';
import { Link } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';

const getEventName = (
  isEligibleForTrial: boolean,
  isBillingManager: boolean
) => {
  if (isEligibleForTrial) {
    const event = 'Limit banner: create sandbox - Start trial';
    return isBillingManager ? event : `${event} - As non-admin`;
  }

  return 'Limit banner: create sandbox - Upgrade';
};

const EVENT_PROPS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

type MaxPublicSandboxesProps = {
  checkoutUrl: string | null;
  isBillingManager: boolean;
  isEligibleForTrial: boolean;
};
export const MaxPublicSandboxes: React.FC<MaxPublicSandboxesProps> = ({
  checkoutUrl,
  isEligibleForTrial,
  isBillingManager,
}) => {
  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free sandboxes. Upgrade for
      more.
      {checkoutUrl ? (
        <MessageStripe.Action
          {...(checkoutUrl.startsWith('/')
            ? {
                as: Link,
                to: `${checkoutUrl}?utm_source=dashboard_upgrade_banner`,
              }
            : {
                as: 'a',
                href: checkoutUrl,
              })}
          onClick={() => {
            track(
              getEventName(isEligibleForTrial, isBillingManager),
              EVENT_PROPS
            );
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
