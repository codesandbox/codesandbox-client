import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { IconButton, Stack, Text, Switch } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import styled from 'styled-components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import {
  CreditAddonType,
  SubscriptionPackage,
} from 'app/overmind/namespaces/checkout/types';
import { SubscriptionInterval } from 'app/graphql/types';
import { fadeAnimation } from './elements';
import { WorkspaceFlow } from './types';

export const Summary: React.FC<{
  allowChanges: boolean;
  flow: WorkspaceFlow;
}> = ({ allowChanges, flow }) => {
  const actions = useActions();
  const { isPro } = useWorkspaceSubscription();
  const { checkout } = useAppState();
  const {
    currentSubscription,
    newSubscription,
    spendingLimit,
    hasUpcomingChange,
  } = checkout;

  const isAnnual =
    newSubscription?.billingInterval === SubscriptionInterval.Yearly;

  // This will enable annual switch if we decide to bring it back
  const allowAnnualSwitch = false;

  return (
    <Stack
      gap={16}
      direction="vertical"
      css={{
        padding: '64px 48px',
        '@media (max-width: 1330px)': {
          padding: '64px 24px',
        },
      }}
    >
      {currentSubscription && hasUpcomingChange && (
        <PlanSummary
          title="Current plan"
          subscriptionPackage={currentSubscription}
          editable={false}
        />
      )}

      {newSubscription && (
        <PlanSummary
          title={currentSubscription ? 'New plan' : 'Plan summary'}
          subscriptionPackage={newSubscription}
          editable={allowChanges}
          onIncrementItem={addonId => {
            actions.checkout.addCreditsPackage(addonId);
            track('Checkout - Increment Addon Item', {
              from: flow,
              addonId,
              currentPlan: isPro ? 'pro' : 'free',
            });
          }}
          onDecrementItem={addonId => {
            actions.checkout.removeCreditsPackage(addonId);
            track('Checkout - Decrement Addon Item', {
              from: flow,
              addonId,
              currentPlan: isPro ? 'pro' : 'free',
            });
          }}
        />
      )}

      {allowAnnualSwitch && (
        <Stack css={{ gap: '8px' }}>
          <Switch
            id="recurring"
            on={isAnnual}
            onChange={() => {
              actions.checkout.selectPlan({
                plan: 'flex',
                billingInterval: isAnnual
                  ? SubscriptionInterval.Monthly
                  : SubscriptionInterval.Yearly,
              });

              track('Checkout - Toggle recurring type', {
                from: flow,
                newValue: isAnnual ? 'annual' : 'monthly',
              });
            }}
          />
          <Stack direction="vertical" css={{ marginTop: -3 }}>
            <Text color="#fff" as="label" htmlFor="recurring">
              Annual (Save 30%)
            </Text>
          </Stack>
        </Stack>
      )}

      <Text size={3}>
        Additional VM credits are available on-demand for $0.015/credit.
        <br />
        Spending limit: ${spendingLimit}
      </Text>
    </Stack>
  );
};

interface PlanSummaryProps {
  title: string;
  subscriptionPackage: SubscriptionPackage;
  editable: boolean;
  onDecrementItem?: (id: CreditAddonType) => void;
  onIncrementItem?: (id: CreditAddonType) => void;
}

const PlanSummary: React.FC<PlanSummaryProps> = ({
  title,
  subscriptionPackage,
  editable,
  onDecrementItem,
  onIncrementItem,
}) => (
  <Stack direction="vertical" gap={6}>
    <Text size={6} color="#fff">
      {title}
    </Text>

    <Stack
      direction="vertical"
      gap={4}
      css={{ paddingBottom: '24px', borderBottom: '1px solid #5C5C5C' }}
    >
      <Stack direction="horizontal" justify="space-between" gap={2}>
        <Stack direction="vertical">
          <Text color="#fff">Monthly base plan</Text>
          <Text>{subscriptionPackage.basePlan.credits} VM credits/month</Text>
        </Stack>
        <Text color="#fff">${subscriptionPackage.basePlan.price}</Text>
      </Stack>

      {subscriptionPackage.addonItems.map(item => (
        <AnimatedLineItem
          direction="horizontal"
          key={item.addon.id}
          align="center"
          justify="space-between"
          gap={2}
        >
          <Text color="#fff">{item.addon.credits} VM credits/month</Text>
          <Stack align="center">
            {editable && (
              <QuantityCounter
                quantity={item.quantity}
                onIncrement={() => onIncrementItem?.(item.addon.id)}
                onDecrement={() => onDecrementItem?.(item.addon.id)}
              />
            )}

            <Text color="#fff" css={{ width: '48px', textAlign: 'right' }}>
              ${item.quantity * item.addon.price}
            </Text>
          </Stack>
        </AnimatedLineItem>
      ))}
    </Stack>

    <Stack justify="space-between">
      <Stack direction="vertical">
        <Text color="#fff">
          Total cost per{' '}
          {subscriptionPackage.billingInterval === SubscriptionInterval.Yearly
            ? 'year'
            : 'month'}
        </Text>
        <Text>{subscriptionPackage.totalCredits} VM credits/month</Text>
      </Stack>

      <Text color="#fff">${subscriptionPackage.totalPrice}</Text>
    </Stack>
  </Stack>
);

const AnimatedLineItem = styled(Stack)`
  animation: ${fadeAnimation};
  height: 28px;
`;

const QuantityCounter: React.FC<{
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}> = ({ quantity, onIncrement, onDecrement }) => {
  return (
    <Stack
      align="center"
      justify="space-between"
      css={{ border: '1px solid #5c5c5c', borderRadius: '4px', width: '84px' }}
    >
      <IconButton
        title={quantity === 1 ? 'Remove addon' : 'Decrease quantity'}
        onClick={onDecrement}
        variant="square"
        name="minus"
        css={{ borderRadius: '3px 0 0 3px' }} // 3px fills the space inside the 4px border radius wrapper
      />
      <Text color="#fff">{quantity}</Text>
      <IconButton
        title="Increase quantity"
        onClick={onIncrement}
        name="plus"
        variant="square"
        css={{ borderRadius: '0 3px 3px 0' }}
      />
    </Stack>
  );
};
