import React from 'react';

import { Icon, MessageStripe, Stack, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import {
  upgradeUrl,
  portalOverview,
} from '@codesandbox/common/lib/utils/url-generator/dashboard';

export const UsageLimitMessageStripe: React.FC = () => {
  const { activeTeam } = useAppState();
  const { isAdmin } = useWorkspaceAuthorization();
  const {
    isOutOfCredits,
    isCloseToOutOfCredits,
    isAtSpendingLimit,
    isCloseToSpendingLimit,
  } = useWorkspaceLimits();

  if (isOutOfCredits) {
    return (
      <MessageStripe variant="error" corners="straight">
        <Stack direction="horizontal" gap={2}>
          <Icon name="circleBang" />
          <Text>
            <Text weight="500">
              You have run out of credits on the Free plan.
            </Text>{' '}
            Your Devboxes have been frozen.{' '}
            {isAdmin
              ? 'To keep using CodeSandbox upgrade to a Pro plan.'
              : 'To keep using CodeSandbox, ask an administrator to upgrade to a Pro plan.'}
          </Text>
        </Stack>
        {isAdmin && (
          <MessageStripe.Action
            as="a"
            href={upgradeUrl({
              workspaceId: activeTeam,
              source: 'out_of_credits_banner',
            })}
          >
            Upgrade to Pro
          </MessageStripe.Action>
        )}
      </MessageStripe>
    );
  }

  if (isCloseToOutOfCredits) {
    return (
      <MessageStripe variant="warning" corners="straight">
        <Stack direction="horizontal" gap={2}>
          <Icon name="circleBang" />
          <Text>
            <Text weight="500">Your workspace is low on credits.</Text> If you
            run out of credits, your Devboxes will be frozen.{' '}
          </Text>
        </Stack>
        {isAdmin && (
          <MessageStripe.Action
            as="a"
            href={upgradeUrl({
              workspaceId: activeTeam,
              source: 'out_of_credits_banner',
            })}
          >
            Upgrade to Pro
          </MessageStripe.Action>
        )}
      </MessageStripe>
    );
  }

  if (isAtSpendingLimit) {
    return (
      <MessageStripe variant="error" corners="straight">
        <Stack direction="horizontal" gap={2}>
          <Icon name="circleBang" />
          <Text>
            <Text weight="500">Spending limit reached.</Text> Your Devboxes have
            been frozen.{' '}
            {isAdmin
              ? 'To keep using CodeSandbox, increase your spending limit.'
              : 'To keep using CodeSandbox, ask an administrator to increase your spending limit.'}
          </Text>
        </Stack>
        {isAdmin && (
          <MessageStripe.Action as="a" href={portalOverview(activeTeam)}>
            Change spending limit
          </MessageStripe.Action>
        )}
      </MessageStripe>
    );
  }

  if (isCloseToSpendingLimit) {
    return (
      <MessageStripe variant="warning" corners="straight">
        <Stack direction="horizontal" gap={2}>
          <Icon name="circleBang" />
          <Text>
            <Text weight="500">
              Your workspace is close to hitting its spending limit.
            </Text>{' '}
            {isAdmin
              ? 'To keep using CodeSandbox, increase your spending limit.'
              : 'To keep using CodeSandbox, ask an administrator to increase your spending limit.'}
          </Text>
        </Stack>
        {isAdmin && (
          <MessageStripe.Action as="a" href={portalOverview(activeTeam)}>
            Change spending limit
          </MessageStripe.Action>
        )}
      </MessageStripe>
    );
  }

  return null;
};
