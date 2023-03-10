import track from '@codesandbox/common/lib/utils/analytics';
import { MessageStripe } from '@codesandbox/components';
import React from 'react';
import { SUBSCRIPTION_DOCS_URLS } from 'app/constants';

const getEventName = (isEligibleForTrial: boolean, isTeamAdmin: boolean) => {
  if (isEligibleForTrial) {
    const event = 'Limit banner: create sandbox - Start trial';
    return isTeamAdmin ? event : `${event} - As non-admin`;
  }

  return 'Limit banner: create sandbox - Upgrade';
};

const EVENT_PROPS = {
  codesandbox: 'V1',
  event_source: 'UI',
};

type MaxPublicReposProps = {
  checkoutUrl: string | undefined;
  isTeamAdmin: boolean;
  isEligibleForTrial: boolean;
};
export const MaxPublicSandboxes: React.FC<MaxPublicReposProps> = ({
  checkoutUrl,
  isEligibleForTrial,
  isTeamAdmin,
}) => {
  return (
    <MessageStripe justify="space-between">
      You&apos;ve reached the maximum amount of free sandboxes. Upgrade for
      more.
      {checkoutUrl ? (
        <MessageStripe.Action
          as="a"
          href={checkoutUrl}
          onClick={() => {
            track(getEventName(isEligibleForTrial, isTeamAdmin), EVENT_PROPS);
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
