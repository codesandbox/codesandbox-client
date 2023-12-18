import React, { useEffect } from 'react';
import { Button, Element, Stack, Text } from '@codesandbox/components';
import {
  CSB_FRIENDS_LINK,
  ORGANIZATION_CONTACT_LINK,
  PlanType,
  PricingPlan,
  UBB_ENTERPRISE_PLAN,
  UBB_FLEX_PLAN,
  UBB_FREE_PLAN,
  UBB_GROWTH_PLAN,
  UBB_STANDARD_PLAN,
} from 'app/constants';
import styled from 'styled-components';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState } from 'app/overmind';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';

export const Plans: React.FC<StepProps> = ({
  onNextStep,
  onEarlyExit,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const {
    getQueryParam,
    setQueryParam,
    removeQueryParam,
  } = useURLSearchParams();
  const { activeTeam } = useAppState();
  const actions = useActions();
  const urlWorkspaceId = getQueryParam('workspace');

  useEffect(() => {
    // Reset selected value in the URL when going on prev step
    removeQueryParam('plan');
  }, []);

  useEffect(() => {
    if (activeTeam !== urlWorkspaceId) {
      actions.setActiveTeam({ id: urlWorkspaceId });
    }
  }, [urlWorkspaceId, activeTeam]);

  const handleChoosePlan = (plan: PlanType) => {
    setQueryParam('plan', plan);
    onNextStep();
  };

  return (
    <AnimatedStep>
      <Stack direction="vertical" gap={9}>
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Choose a plan"
        />

        <Stack gap={6}>
          <StyledCard
            direction="vertical"
            align="center"
            gap={12}
            css={{ background: '#1d1d1d', color: '#e5e5e5', width: 300 }}
          >
            <CardHeading>For learning and experimenting</CardHeading>
            <PlanAndPricing plan={UBB_FREE_PLAN} />
            <Button
              autoWidth
              variant="secondary"
              size="large"
              onClick={onEarlyExit}
            >
              Choose Free
            </Button>
            <PlanCredits plan={UBB_FREE_PLAN} />
            <PlanFeatures
              features={[
                '5 members',
                '20 Sandboxes',
                'Unlimited Devboxes',
                'Unlimited repositories',
              ]}
            />
            <PlanVMs plan={UBB_FREE_PLAN} />
          </StyledCard>
          <StyledCard
            direction="vertical"
            align="center"
            gap={12}
            css={{ borderColor: '#AC9CFF' }}
          >
            <CardHeading>Pay as you go with a monthly subscription</CardHeading>
            <Element
              css={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '32px',
              }}
            >
              <Stack direction="vertical" gap={12} align="center">
                <PlanAndPricing plan={UBB_FLEX_PLAN} />
                <Button
                  variant="dark"
                  size="large"
                  onClick={() => handleChoosePlan('flex')}
                >
                  Choose Pro Flex
                </Button>
                <PlanCredits plan={UBB_FLEX_PLAN} />
              </Stack>
              <Stack direction="vertical" gap={12} align="center">
                <PlanAndPricing plan={UBB_STANDARD_PLAN} />
                <Button
                  variant="dark"
                  size="large"
                  onClick={() => handleChoosePlan('standard')}
                >
                  Choose Pro Standard
                </Button>
                <PlanCredits plan={UBB_STANDARD_PLAN} />
              </Stack>
              <Stack direction="vertical" gap={12} align="center">
                <PlanAndPricing plan={UBB_GROWTH_PLAN} />
                <Button
                  variant="dark"
                  size="large"
                  onClick={() => handleChoosePlan('growth')}
                >
                  Choose Pro Growth
                </Button>
                <PlanCredits plan={UBB_GROWTH_PLAN} />
              </Stack>
            </Element>
            <PlanFeatures
              features={[
                '20 members',
                '50 Sandboxes',
                'Unlimited Devboxes',
                'Unlimited repositories',
              ]}
            />
            <PlanVMs plan={UBB_STANDARD_PLAN} />
          </StyledCard>
          <StyledCard
            direction="vertical"
            align="center"
            gap={12}
            css={{ borderColor: '#EAFF96', width: 300 }}
          >
            <CardHeading>
              The future of Cloud Development Environments
            </CardHeading>
            <PlanAndPricing plan={UBB_ENTERPRISE_PLAN} />
            <Button
              as="a"
              href={ORGANIZATION_CONTACT_LINK}
              variant="dark"
              size="large"
            >
              Contact us
            </Button>
            <Stack direction="vertical" gap={6}>
              <Text size={3}>Everything in Pro, plus:</Text>

              <PlanFeatures
                features={[
                  'Unlimited members',
                  'Unlimited API',
                  'On-premise options',
                  'Private managed cloud',
                  'Dedicated support',
                  'SSO',
                ]}
              />
            </Stack>

            <PlanVMs plan={UBB_ENTERPRISE_PLAN} />
          </StyledCard>
        </Stack>
        <Stack
          css={{ background: '#1d1d1d', color: '#fff', padding: '32px' }}
          direction="vertical"
          align="center"
          gap={1}
        >
          <Text weight="700">Working with open source?</Text>
          <Text size={3}>
            Get major discounts through our{' '}
            <Text
              as="a"
              href={CSB_FRIENDS_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              CodeSandbox Friends program
            </Text>
            !
          </Text>
        </Stack>
      </Stack>
    </AnimatedStep>
  );
};

const StyledCard = styled(Stack)`
  border-top: 32px solid #252525;
  background: #fff;
  color: #000;
  padding: 40px 32px;
  border-radius: 2px;
`;

const CardHeading = styled(Text)`
  font-size: 13px;
  text-align: center;
  max-width: 180px;
`;

const PlanAndPricing: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const isPro = plan.id !== 'free' && plan.id !== 'enterprise';

  return (
    <Stack direction="vertical" align="center" gap={2}>
      <Stack direction="vertical" align="center">
        {isPro ? (
          <Text size={7} fontFamily="everett" weight="700">
            Pro
          </Text>
        ) : (
          <Element css={{ height: 37 }} />
        )}

        <Text size={7} fontFamily="everett" weight="700">
          {plan.name}
        </Text>
      </Stack>
      <Text size={9} fontFamily="everett" weight="700">
        {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
      </Text>
      {plan.id === 'free' && <Text weight="700">forever</Text>}
      {plan.id === 'enterprise' && <Element css={{ height: '20px' }} />}
      {isPro && <Text weight="700">per month</Text>}
    </Stack>
  );
};

const PlanCredits: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
  <Stack direction="vertical" align="center">
    <Text size={3}>{plan.credits} credits per month</Text>
    {plan.additionalCreditsCost ? (
      <Text size={3}>Add more for ${plan.additionalCreditsCost}/cr</Text>
    ) : null}
  </Stack>
);

const PlanFeatures: React.FC<{ features: string[] }> = ({ features }) => (
  <Stack direction="vertical" align="center">
    {features.map(feature => (
      <Text size={3} key={feature}>
        {feature}
      </Text>
    ))}
  </Stack>
);

const PlanVMs: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
  <Stack direction="vertical" align="center">
    <Text size={3}>Virtual machine options:</Text>
    <Text css={{ textWrap: 'balance', textAlign: 'center' }} size={3}>
      {plan.availableVMs.map(vmType => vmType).join(', ')}
    </Text>
  </Stack>
);
