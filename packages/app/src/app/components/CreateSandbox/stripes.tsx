import React from 'react';
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
  onCreateCheckout: () => void;
  isBillingManager: boolean;
  isEligibleForTrial: boolean;
  isFree: boolean;
};
export const MaxPublicSandboxes: React.FC<MaxPublicSandboxesProps> = ({
  onCreateCheckout,
  isEligibleForTrial,
  isBillingManager,
  isFree,
}) => {
  const canCheckout = (isFree && isBillingManager) || isEligibleForTrial;

  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free sandboxes. Upgrade for
      more.
      {canCheckout ? (
        <MessageStripe.Action
          onClick={() => {
            onCreateCheckout();

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
