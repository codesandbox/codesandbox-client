import React from 'react';
import { Stack, Button, Text, Element } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions, useAppState } from 'app/overmind';
import styled from 'styled-components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useLocation } from 'react-router-dom';
import { CreditAddon } from 'app/overmind/namespaces/checkout/types';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const Addons: React.FC<StepProps> = ({
  onNextStep,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const {
    checkout: { availableCreditAddons },
  } = useAppState();
  const { isPro } = useWorkspaceSubscription();
  const { checkout } = useActions();
  const { getQueryParam } = useURLSearchParams();
  const { pathname } = useLocation();
  const urlWorkspaceId = getQueryParam('workspace');
  const isUpgrading = pathname.includes('upgrade');

  const handleSubmit = () => {
    if (isPro) {
      checkout.calculateConversionCharge({ workspaceId: urlWorkspaceId });
    }

    track('Checkout - Next from addons', {
      from: isUpgrading ? 'upgrade' : 'create-workspace',
      currentPlan: isPro ? 'pro' : 'free',
    });
    onNextStep();
  };

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={12}>
        <StepHeader
          onPrevStep={() => {
            checkout.clearCheckout();
            onPrevStep();
          }}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Choose your add-ons (optional)"
          workspaceId={urlWorkspaceId}
        />

        <Stack direction="vertical" gap={8}>
          <Stack direction="vertical" gap={2}>
            <Text color="#e5e5e5" size={6}>
              Would you like to add more VM credits to your plan?
            </Text>
            <Text>
              You need VM credits to run Devboxes, our Cloud Development
              Environment.{' '}
              <Text
                css={{ textDecoration: 'none', color: '#DCF76E' }}
                as="a"
                target="_blank"
                href="https://codesandbox.io/docs/learn/plans/ubb"
              >
                Learn more
              </Text>
            </Text>
          </Stack>
          <Element
            css={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              width: '100%',
              gap: '16px',
              '@media (max-width: 1460px)': {
                gridTemplateColumns: '1fr 1fr',
              },
              '@media (max-width: 1170px)': {
                gridTemplateColumns: '1fr',
              },
            }}
          >
            {Object.values(availableCreditAddons).map(addon => (
              <CreditAddonButton key={addon.id} addon={addon} />
            ))}
          </Element>
        </Stack>

        <Button autoWidth size="large" onClick={handleSubmit}>
          Next
        </Button>
      </Stack>
    </AnimatedStep>
  );
};

const CreditAddonButton = ({ addon }: { addon: CreditAddon }) => {
  const actions = useActions();
  const { isPro } = useWorkspaceSubscription();
  const { pathname } = useLocation();
  const isUpgrading = pathname.includes('upgrade');

  return (
    <StyledAddonButton
      onClick={() => {
        track('Checkout - Click on addon', {
          from: isUpgrading ? 'upgrade' : 'create-workspace',
          currentPlan: isPro ? 'pro' : 'free',
          addonId: addon.id,
        });
        actions.checkout.addCreditsPackage(addon);
      }}
    >
      <Stack
        css={{
          width: '100%',
          justifyContent: 'space-between',
        }}
        gap={4}
      >
        <Stack direction="vertical">
          <Text color="#e5e5e5">{addon.credits} VM credits</Text>
          <Text size={2}>Up to {addon.credits / 10} hours of VM usage</Text>
        </Stack>
        <StyledPrice addon={addon} />
      </Stack>
    </StyledAddonButton>
  );
};

const StyledPrice = ({ addon }: { addon: CreditAddon }) => (
  <Stack direction="vertical" align="flex-end">
    <Text color="#e5e5e5" css={{ textWrap: 'nowrap' }}>
      {addon.fullPrice && (
        <Text color="#a6a6a6" css={{ textDecoration: 'line-through' }}>
          ${addon.fullPrice}
        </Text>
      )}{' '}
      ${addon.price}
    </Text>
    {addon.discount && (
      <Text size={2} color={addon.discount === 30 ? '#BDB1F6' : '#DCF76E'}>
        Save {addon.discount}%
      </Text>
    )}
  </Stack>
);

const StyledAddonButton = styled.button`
  display: flex;
  align-items: flex-start;
  border: 1px solid #5c5c5c;
  background: transparent;
  color: inherit;
  font-family: inherit;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.125s ease-in;

  &:hover {
    background-color: #242424;
  }
`;
