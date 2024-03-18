import React from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { IconButton, Stack, Text, Switch } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import styled from 'styled-components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useLocation } from 'react-router-dom';
import { fadeAnimation } from './elements';

export const Summary: React.FC<{ allowChanges: boolean }> = ({
  allowChanges,
}) => {
  const actions = useActions();
  const { isPro } = useWorkspaceSubscription();
  const { pathname } = useLocation();
  const isUpgrading = pathname.includes('upgrade');
  const { checkout } = useAppState();
  const {
    selectedPlan,
    creditAddons,
    totalCredits,
    totalPrice,
    spendingLimit,
    availableBasePlans,
  } = checkout;

  const basePlan = availableBasePlans[selectedPlan];
  const isAnnual = selectedPlan === 'flex-annual';

  if (!basePlan) {
    return null;
  }

  return (
    <Stack
      gap={10}
      direction="vertical"
      css={{
        padding: '64px 48px',
        '@media (max-width: 1330px)': {
          padding: '64px 24px',
        },
      }}
    >
      <Text size={6} color="#fff">
        Plan summary
      </Text>

      <Stack
        direction="vertical"
        gap={6}
        css={{ paddingBottom: '24px', borderBottom: '1px solid #5C5C5C' }}
      >
        <Stack direction="horizontal" justify="space-between" gap={2}>
          <Stack direction="vertical">
            <Text color="#fff">{basePlan.name} plan base</Text>
            <Text>{basePlan.credits} VM credits</Text>
          </Stack>
          <Text color="#fff">${basePlan.price}</Text>
        </Stack>

        {creditAddons.map(item => (
          <AnimatedLineItem
            direction="horizontal"
            key={item.addon.id}
            align="center"
            justify="space-between"
            gap={2}
          >
            <Text color="#fff">{item.addon.credits} VM credits</Text>
            <Stack align="center">
              {allowChanges && (
                <QuantityCounter
                  quantity={item.quantity}
                  onIncrement={() => {
                    actions.checkout.addCreditsPackage(item.addon);
                    track('Checkout - Increment Addon Item', {
                      from: isUpgrading ? 'upgrade' : 'create-workspace',
                      currentPlan: isPro ? 'pro' : 'free',
                    });
                  }}
                  onDecrement={() => {
                    actions.checkout.removeCreditsPackage(item.addon.id);
                    track('Checkout - Decrement Addon Item', {
                      from: isUpgrading ? 'upgrade' : 'create-workspace',
                      currentPlan: isPro ? 'pro' : 'free',
                    });
                  }}
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
          <Text color="#fff">Total cost per {isAnnual ? 'year' : 'month'}</Text>
          <Text>{totalCredits} VM credits</Text>
        </Stack>

        <Text color="#fff">${totalPrice}</Text>
      </Stack>

      <Stack css={{ gap: '8px' }}>
        <Switch
          id="recurring"
          on={isAnnual}
          onChange={() => {
            actions.checkout.selectPlan(isAnnual ? 'flex' : 'flex-annual');

            track('Checkout - Toggle recurring type', {
              from: 'summary',
              newValue: isAnnual ? 'annual' : 'monthly',
            });
          }}
        />
        <Stack direction="vertical" css={{ marginTop: -3 }}>
          <Text color="#fff" as="label" htmlFor="recurring">
            Annual (Save 30%)
          </Text>

          {isAnnual && <Text>24 hour processing time</Text>}
        </Stack>
      </Stack>

      <Text size={3}>
        Additional VM credits are available on-demand for $0.018/credit.
        <br />
        Spending limit: ${spendingLimit}
      </Text>
    </Stack>
  );
};

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
