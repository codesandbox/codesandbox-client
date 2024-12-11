import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Element,
  Icon,
  IconNames,
  Stack,
  Text,
  Tooltip,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { CSB_FRIENDS_LINK, ORGANIZATION_CONTACT_LINK } from 'app/constants';
import styled from 'styled-components';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { VMTier } from 'app/overmind/effects/api/types';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { PricingPlan } from 'app/overmind/namespaces/checkout/types';
import { SubscriptionInterval } from 'app/graphql/types';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';
import { FAQ } from './FAQ';
import {
  BUILDER_FEATURES,
  ENTERPRISE_FEATURES,
  FREE_FEATURES,
  PRO_FEATURES,
  PricingPlanFeatures,
} from './constants';

export const Plans: React.FC<StepProps> = ({
  onNextStep,
  onEarlyExit,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
  flow,
}) => {
  const { getQueryParam } = useURLSearchParams();
  const { activeTeam, checkout } = useAppState();

  const actions = useActions();
  const effects = useEffects();
  const urlWorkspaceId = getQueryParam('workspace');
  const [tiers, setTiers] = useState<VMTier[]>([]);
  const { isFree, proPlanType } = useWorkspaceSubscription();

  const showFreePlan = isFree;
  const [billingInterval, setBillingInterval] = useState(
    SubscriptionInterval.Monthly
  );

  const {
    availableBasePlans: {
      enterprise: enterprisePlan,
      flex: proPlan,
      builder: builderPlan,
      free: freePlan,
    },
  } = checkout;

  // For new workspaces
  const freeButtonCTA =
    flow === 'create-workspace' ? 'Get started for free' : 'Continue on Free';

  const proButtonCTA = isFree
    ? 'Start your Pro plan'
    : proPlanType === 'flex'
    ? 'Continue on Pro'
    : 'Downgrade to Pro';

  const builderButtonCTA = isFree
    ? 'Start your Builder plan'
    : proPlanType === 'builder'
    ? 'Continue on Builder'
    : 'Upgrade to Builder';

  useEffect(() => {
    actions.checkout.fetchPrices();
    effects.api.getVMSpecs().then(res => setTiers(res.vmTiers));
  }, []);

  useEffect(() => {
    if (activeTeam !== urlWorkspaceId) {
      actions.setActiveTeam({ id: urlWorkspaceId });
    }
  }, [urlWorkspaceId, activeTeam, actions]);

  const handleProPlanSelection = async () => {
    actions.checkout.selectPlan({ plan: proPlan.id, billingInterval });
    track('Checkout - Select Pro Plan', {
      from: flow,
      currentPlan: isFree ? 'free' : 'pro',
    });
    onNextStep();
  };

  const handleBuilderPlanSelection = async () => {
    actions.checkout.selectPlan({ plan: builderPlan.id, billingInterval });
    track('Checkout - Select Builder Plan', {
      from: flow,
      currentPlan: isFree ? 'free' : 'pro',
    });
    onNextStep();
  };

  return (
    <AnimatedStep css={{ width: '100%' }}>
      <Stack
        direction="vertical"
        gap={64}
        css={{
          maxWidth: isFree ? '1368px' : '1026px',
          margin: 'auto',
          paddingBottom: 120,
        }}
      >
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Choose a plan"
          workspaceId={urlWorkspaceId}
        />

        <Stack gap={4} direction="vertical">
          <Stack css={{ justifyContent: 'center' }}>
            <RecurringType
              current={billingInterval}
              onChangeValue={interval => {
                setBillingInterval(interval);
                actions.checkout.selectPlan({
                  plan: proPlan.id,
                  billingInterval: interval,
                });
              }}
            />
          </Stack>

          <HorizontalScroller css={{ width: '100%' }}>
            <Stack gap={4}>
              {showFreePlan && (
                <StyledCard
                  direction="vertical"
                  align="center"
                  gap={8}
                  css={{
                    background: '#1d1d1d',
                    color: '#e5e5e5',

                    '& a': { color: '#DCF76E' },
                  }}
                >
                  <Text size={7} fontFamily="everett" weight="medium">
                    {freePlan.name}
                  </Text>
                  <CardHeading>For learning and experimenting</CardHeading>
                  <PlanPricing plan={freePlan} />

                  <Button
                    css={{
                      background: '#F0F0F0',
                      '&:hover': { backgroundColor: '#fff' },
                    }}
                    size="large"
                    onClick={() => {
                      track('Checkout - Select Free Plan', {
                        from: flow,
                        currentPlan: isFree ? 'free' : 'pro',
                      });
                      onEarlyExit();
                    }}
                  >
                    {freeButtonCTA}
                  </Button>

                  <PlanFeatures
                    heading="Usage"
                    secondaryColor="#a6a6a6"
                    features={freePlan.usage}
                    includeTooltips
                  />
                  <PlanFeatures
                    heading="Features"
                    secondaryColor="#a6a6a6"
                    features={freePlan.features}
                  />
                </StyledCard>
              )}
              <StyledCard
                direction="vertical"
                align="center"
                gap={8}
                css={{ borderColor: '#9581FF' }}
              >
                <Text size={7} fontFamily="everett" weight="medium">
                  {proPlan.name}
                </Text>
                <CardHeading>
                  Pay as you go with a monthly subscription
                </CardHeading>
                <PlanPricing plan={proPlan} interval={billingInterval} />
                <Button
                  variant="dark"
                  css={{
                    background: '#644ED7',
                    '&:hover': { background: '#7B61FF' },
                  }}
                  size="large"
                  onClick={handleProPlanSelection}
                >
                  {proButtonCTA}
                </Button>
                <PlanFeatures
                  heading="Usage"
                  features={proPlan.usage}
                  includeTooltips
                />
                <PlanFeatures heading="Features" features={proPlan.features} />
              </StyledCard>
              <StyledCard
                direction="vertical"
                align="center"
                gap={8}
                css={{ borderColor: '#6BAAF7' }}
              >
                <Text size={7} fontFamily="everett" weight="medium">
                  {builderPlan.name}
                </Text>
                <CardHeading>
                  Use CodeSandbox SDK with higher limits
                </CardHeading>
                <PlanPricing plan={builderPlan} interval={billingInterval} />
                <Button
                  variant="dark"
                  css={{
                    background: '#6BAAF7',
                    '&:hover': { background: '#7B61FF' },
                  }}
                  size="large"
                  onClick={handleBuilderPlanSelection}
                >
                  {builderButtonCTA}
                </Button>
                <PlanFeatures
                  heading="Usage"
                  features={builderPlan.usage}
                  includeTooltips
                />
                <PlanFeatures
                  heading="Features"
                  features={builderPlan.features}
                />
              </StyledCard>
              <StyledCard
                direction="vertical"
                align="center"
                gap={8}
                css={{
                  borderColor: '#E3FF73',
                }}
              >
                <Text size={7} fontFamily="everett" weight="medium">
                  {enterprisePlan.name}
                </Text>
                <CardHeading>
                  The future of Cloud Development Environments
                </CardHeading>
                <PlanPricing plan={enterprisePlan} overridePrice="Custom" />
                <Button
                  as="a"
                  href={ORGANIZATION_CONTACT_LINK}
                  onClick={() => {
                    track('Checkout - Select Enterprise Plan', {
                      from: flow,
                      currentPlan: isFree ? 'free' : 'pro',
                    });
                  }}
                  variant="primary"
                  size="large"
                  target="_blank"
                  style={{ backgroundColor: '#DCFF50' }}
                >
                  Contact us
                </Button>
                <Stack direction="vertical" gap={4}>
                  <Text>Everything in Pro, plus:</Text>
                  <PlanFeatures features={enterprisePlan.features} />
                </Stack>
              </StyledCard>
            </Stack>
          </HorizontalScroller>
          <CodeSandboxFriendsCard />
        </Stack>
        <FeaturesComparison
          plans={[
            FREE_FEATURES,
            PRO_FEATURES,
            BUILDER_FEATURES,
            ENTERPRISE_FEATURES,
          ]}
        />
        <VMSpecs tiers={tiers} />

        <FAQ />
      </Stack>
    </AnimatedStep>
  );
};

const StyledCard = styled(Stack)`
  border-top: 32px solid #323232;
  background: #fff;
  color: #000;
  padding: 40px 32px;
  border-radius: 8px;
  flex-shrink: 0;
  width: 330px;

  @media (max-width: 1400px) {
    padding: 40px 20px;
  }
`;

const CardHeading = styled(Text)`
  text-align: center;
  max-width: 220px;
`;

const GridCell = styled(Stack)`
  padding: 24px 16px;
  max-height: 80px;
  width: 100%;
  min-width: 160px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 16px 8px;
    min-width: 170px;

    & span[size='5'] {
      font-size: 16px;
    }
  }
`;

const GridCellDetails = styled(GridCell)`
  min-height: 100px;
  text-align: center;
  line-height: 1.4;
  small {
    font-size: 12px;
    color: #a6a6a6;
    padding-top: 4px;
  }
`;

const HorizontalScroller = styled(Element)`
  overflow-x: scroll;
  margin-left: auto;
  margin-right: auto;
  @media (max-width: 1040px) {
    width: 100%;
  }
`;

const PlanPricing: React.FC<{
  plan: PricingPlan;
  interval?: SubscriptionInterval;
  overridePrice?: string;
}> = ({ plan, interval = SubscriptionInterval.Monthly, overridePrice }) => {
  const isPro = plan.id === 'flex' || plan.id === 'builder';

  return (
    <Stack direction="vertical" align="center" gap={2}>
      <Stack direction="vertical" align="center">
        {isPro ? (
          <Text align="center" weight="medium">
            From
          </Text>
        ) : (
          <Element css={{ height: 20 }} />
        )}
      </Stack>
      <Element css={{ position: 'relative' }}>
        <Text size={9} fontFamily="everett" weight="medium">
          {overridePrice ||
            `$${
              interval === SubscriptionInterval.Monthly
                ? plan.priceMonthly
                : plan.priceYearly / 12
            }`}
        </Text>
      </Element>

      {(plan.id === 'free' || plan.id === 'enterprise') && (
        <Element css={{ height: '40px' }} />
      )}
      {isPro && (
        <Text
          align="center"
          weight="medium"
          css={{ textWrap: 'balance', width: 180 }}
        >
          {interval === SubscriptionInterval.Monthly
            ? 'per month per workspace'
            : 'per workspace per month billed annually'}
        </Text>
      )}
    </Stack>
  );
};

const PlanFeatures: React.FC<{
  features: string[];
  heading?: string;
  secondaryColor?: string;
  itemIcon?: IconNames;
  includeTooltips?: boolean;
}> = ({
  features,
  heading,
  secondaryColor = '#5c5c5c',
  itemIcon = 'simpleCheck',
  includeTooltips = false,
}) => (
  <Stack
    direction="vertical"
    align="flex-start"
    css={{ width: '100%' }}
    gap={4}
  >
    {heading && (
      <Text css={{ marginLeft: '28px' }} size={3} color={secondaryColor}>
        {heading}
      </Text>
    )}
    <Stack as="ul" css={{ padding: 0, margin: 0 }} gap={4} direction="vertical">
      {features.map(feature => (
        <Stack as="li" key={feature.toString()} gap={2} align="flex-start">
          <Icon color={secondaryColor} name={itemIcon} size={20} />
          {includeTooltips ? (
            <TextWithTooltips text={feature} />
          ) : (
            <Text>{feature}</Text>
          )}
        </Stack>
      ))}
    </Stack>
  </Stack>
);

export const EXPLAINED_FEATURES: Record<string, string> = {
  'VM credits':
    'Credits measure VM runtime and apply to Devboxes and Repositories.',
  Devboxes:
    'Devboxes are our Cloud Development Environment, which runs in virtual machines and requires VM credits.',
  Sandboxes:
    "Sandboxes are powered by your browser and don't require credits to run.",
};

const TextWithTooltips = ({ text }: { text: string }) => {
  const explainedKeys = Object.keys(EXPLAINED_FEATURES);
  const keyInText = explainedKeys.find(key => text.includes(key));
  if (!keyInText) {
    return <Text>{text}</Text>;
  }

  return (
    <Text>
      {text.split(keyInText)[0]}
      <Tooltip label={EXPLAINED_FEATURES[keyInText]}>
        <Text css={{ borderBottom: '1px dotted currentColor' }}>
          {keyInText}
        </Text>
      </Tooltip>
      {text.split(keyInText)[1]}
    </Text>
  );
};

const CodeSandboxFriendsCard = () => (
  <Stack
    css={{
      background: '#1d1d1d',
      color: '#e5e5e5',
      padding: '24px 32px',
      borderRadius: '8px',
      width: '100%',
      gap: '8px',
      alignItems: 'center',

      '@media (max-width: 1400px)': {
        maxWidth: '1240px',
        marginLeft: 'auto',
        marginRight: 'auto',
      },

      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    }}
  >
    <Stack direction="vertical" gap={2}>
      <Text weight="medium" fontFamily="everett" size={6}>
        Discounts for education, open source and non-profits.
      </Text>
      <Text css={{ textWrap: 'balance' }}>
        Get special conditions and free or low-cost access to CodeSandbox if
        you&apos;re working on educational projects, licensed open-source
        software, developer community projects or for non-profit organizations.
      </Text>
    </Stack>
    <Button
      as="a"
      autoWidth
      size="large"
      href={CSB_FRIENDS_LINK}
      target="_blank"
      rel="noopener noreferrer"
      title="Learn more about CodeSandbox Friends"
    >
      Learn more
    </Button>
  </Stack>
);

const VMSpecs: React.FC<{ tiers: VMTier[] }> = ({ tiers }) => (
  <Stack
    direction="vertical"
    align="center"
    gap={11}
    css={{ color: '#e5e5e5' }}
  >
    <Text weight="medium" size={7} fontFamily="everett" id="vm-types">
      Virtual machine types
    </Text>
    <HorizontalScroller>
      <Element
        css={{
          display: 'grid',
          gridTemplateColumns: `repeat(5, 1fr)`,
          '& > *:not(:nth-child(-n+5))': {
            borderTop: '1px solid #252525',
          },
          borderBottom: '1px solid #252525',
        }}
      >
        <GridCell />
        <GridCell css={{ justifyContent: 'flex-start' }}>
          <Text weight="medium" size={5}>
            Credits / hour
          </Text>
        </GridCell>
        <GridCell css={{ justifyContent: 'flex-start' }}>
          <Text weight="medium" size={5}>
            Cost / hour
          </Text>
          <Text
            size={3}
            color="#999"
            css={{
              maxWidth: '180px',
              textAlign: 'center',
              textWrap: 'balance',
            }}
          >
            Without&nbsp;subscription savings
          </Text>
        </GridCell>
        <GridCell css={{ justifyContent: 'flex-start' }}>
          <Text weight="medium" size={5}>
            CPU
          </Text>
        </GridCell>
        <GridCell css={{ justifyContent: 'flex-start' }}>
          <Text weight="medium" size={5}>
            RAM
          </Text>
        </GridCell>
        {tiers.map(tier => (
          <Fragment key={tier.shortid}>
            <GridCell direction="vertical" css={{ alignItems: 'flex-start' }}>
              <Text weight="medium" size={5}>
                {tier.name}
              </Text>
              {(tier.shortid === 'vm-3' || tier.shortid === 'vm-4') && (
                <Text size={3} color="#999">
                  Available from Pro
                </Text>
              )}
              {(tier.shortid === 'vm-5' || tier.shortid === 'vm-6') && (
                <Text size={3} color="#999">
                  Available on Enterprise
                </Text>
              )}
            </GridCell>
            <GridCell>
              <Text>{tier.creditBasis} credits</Text>
            </GridCell>
            <GridCell>
              <Text>${tier.creditBasis * 0.018}</Text>
            </GridCell>
            <GridCell>
              <Text>{tier.cpu} cores</Text>
            </GridCell>
            <GridCell>
              <Text>{tier.memory} GB</Text>
            </GridCell>
          </Fragment>
        ))}
      </Element>
    </HorizontalScroller>
  </Stack>
);

const FeaturesComparison: React.FC<{ plans: PricingPlanFeatures[] }> = ({
  plans,
}) => (
  <Stack
    direction="vertical"
    align="center"
    gap={11}
    css={{ color: '#e5e5e5' }}
  >
    <Text weight="medium" fontFamily="everett" size={7}>
      Plan details
    </Text>

    <HorizontalScroller>
      <Element
        css={{
          display: 'grid',
          gridTemplateColumns: `repeat(5, 1fr)`,
          '& > *:not(:nth-child(-n+5))': {
            borderTop: '1px solid #252525',
          },
          borderBottom: '1px solid #252525',
        }}
      >
        <GridCell />
        <GridCell>
          <Text weight="medium" size={5}>
            Free
          </Text>
        </GridCell>
        <GridCell>
          <Text weight="medium" size={5}>
            Pro
          </Text>
        </GridCell>
        <GridCell>
          <Text weight="medium" size={5}>
            Builder
          </Text>
        </GridCell>
        <GridCell>
          <Text weight="medium" size={5}>
            Enterprise
          </Text>
        </GridCell>

        <FeatureComparisonNumbersRow
          title="Members"
          description="The maximum number of members in the workspace."
          plans={plans}
          property="members"
        />
        <FeatureComparisonNumbersRow
          title="Sandboxes"
          description={
            <>
              The maximum number of Sandboxes in a workspace. <br />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://codesandbox.io/docs/learn/devboxes/editors?tab=sandbox"
              >
                Learn more about Sandboxes.
              </a>
            </>
          }
          plans={plans}
          property="sandboxes"
        />
        <FeatureComparisonNumbersRow
          title="Devboxes"
          description={
            <>
              The maximum number of Devboxes in a workspace.
              <br />
              <a
                target="_blank"
                rel="noreferrer"
                href="https://codesandbox.io/docs/learn/devboxes/overview?tab=devbox#difference-between-devboxes--sandboxes"
              >
                Learn more about Devboxes.
              </a>
            </>
          }
          plans={plans}
          property="devboxes"
        />
        <FeatureComparisonNumbersRow
          title="Concurrent Devboxes"
          description="The maximum number of concurrently running Devboxes for CodeSandbox SDK."
          plans={plans}
          property="concurrentDevboxes"
        />
        <FeatureComparisonNumbersRow
          title="Session Length"
          description="How long you can run your Sandboxes and Devboxes for."
          plans={plans}
          property="sessionLength"
        />
        <FeatureComparisonNumbersRow
          title="Repositories"
          description="Maximum number of repositories that can be imported in the workspace."
          plans={plans}
          property="repositories"
        />
        <FeatureComparisonNumbersRow
          title="Virtual machines"
          description="Specs for the best virtual machines that can be used."
          plans={plans}
          property="vmType"
        />
        <FeatureComparisonBooleanRow
          title="CodeSandbox SDK"
          description="Programmatically create and manage Devboxes at scale."
          plans={plans}
          property="sdk"
        />
        <FeatureComparisonBooleanRow
          title="Private projects"
          description="Restrict access to your Sandboxes, Devboxes or repositories."
          plans={plans}
          property="privateProject"
        />
        <FeatureComparisonBooleanRow
          title="Shareable links"
          description="Share your devboxes and sandboxes with users outside of your workspace."
          plans={plans}
          property="shareableLinks"
        />
        <FeatureComparisonBooleanRow
          title="Live sessions"
          description="Collaborate with others on your devboxes and repositories."
          plans={plans}
          property="liveSessions"
        />
        <FeatureComparisonBooleanRow
          title="API access"
          description="Automatically create, share and delete sandboxes and branches."
          plans={plans}
          property="apiAccess"
        />
        <FeatureComparisonBooleanRow
          title="Instant environment resume"
          description="Load an existing Devbox in seconds without having to rebuild all assets."
          plans={plans}
          property="instantEnvironmentResume"
        />
        <FeatureComparisonBooleanRow
          title="Instant environment share"
          description="Share your Devbox with the same VM and settings with your team in seconds."
          plans={plans}
          property="instantEnvironmentShare"
        />
        <FeatureComparisonBooleanRow
          title="Private NPM"
          description="Use private npm packages from your own custom registry."
          plans={plans}
          property="privateNPM"
        />

        <FeatureComparisonBooleanRow
          title="Protected previews"
          description="Protect who can view your dev server preview. (Coming soon)."
          plans={plans}
          property="protectedPreviews"
        />
        <FeatureComparisonBooleanRow
          title="SSO"
          description="Single Sign-On support for Okta and more."
          plans={plans}
          property="sso"
        />
        <FeatureComparisonBooleanRow
          title="SOC 2 compliance"
          description="Ensure the security of your data with our SOC 2 Type II compliance."
          plans={plans}
          property="soc2"
        />

        <FeatureComparisonBooleanRow
          title="Private cloud"
          description="All static files are served via CDN."
          plans={plans}
          property="privateCloud"
        />

        <FeatureComparisonBooleanRow
          title="On-premise options"
          description="Run on your own infrastructure and we manage it."
          plans={plans}
          property="onPremise"
        />
      </Element>
    </HorizontalScroller>
  </Stack>
);

type FeatureComparisonRowProps = {
  plans: PricingPlanFeatures[];
  property: keyof PricingPlanFeatures;
  title: string;
  description: React.ReactNode;
};

const FeatureComparisonNumbersRow: React.FC<FeatureComparisonRowProps> = ({
  plans,
  property,
  title,
  description,
}) => (
  <>
    <GridCellDetails css={{ alignItems: 'flex-start' }}>
      <Text weight="medium" size={5}>
        {title}
      </Text>
      <Text
        size={3}
        color="#999"
        css={{ a: { color: '#DCF76E', textDecoration: 'none' } }}
      >
        {description}
      </Text>
    </GridCellDetails>

    {plans.map(p => (
      <GridCellDetails
        key={p.id}
        dangerouslySetInnerHTML={{
          // @ts-ignore
          __html:
            p[property] === Number.MAX_SAFE_INTEGER ? 'Unlimited' : p[property],
        }}
      />
    ))}
  </>
);

const FeatureComparisonBooleanRow: React.FC<FeatureComparisonRowProps> = ({
  plans,
  property,
  title,
  description,
}) => (
  <>
    <GridCellDetails css={{ alignItems: 'flex-start' }}>
      <Text weight="medium" size={5}>
        {title}
      </Text>
      <Text size={3} color="#999">
        {description}
      </Text>
    </GridCellDetails>

    {plans.map(p => (
      <GridCellDetails key={p.id}>
        <Icon
          name={p[property] ? 'simpleCheck' : 'cross'}
          color={p[property] ? '#43BB30' : '#DD5F5F'}
          size={16}
        />
      </GridCellDetails>
    ))}
  </>
);

type RecurringTypeProps = {
  current: SubscriptionInterval;
  onChangeValue: (value: SubscriptionInterval) => void;
};

const RecurringType: React.FC<RecurringTypeProps> = ({
  current,
  onChangeValue,
}) => {
  return (
    <Stack
      css={{
        background: '#1D1D1D',
        padding: 3,
        borderRadius: 999999,
        border: '1px solid #323232',
      }}
    >
      <RecurringTypeButton
        type="button"
        data-active={current === SubscriptionInterval.Yearly}
        onClick={() => onChangeValue(SubscriptionInterval.Yearly)}
      >
        <Text>Annual (Save 30%)</Text>
      </RecurringTypeButton>
      <RecurringTypeButton
        type="button"
        data-active={current === SubscriptionInterval.Monthly}
        onClick={() => onChangeValue(SubscriptionInterval.Monthly)}
      >
        <Text>Monthly</Text>
      </RecurringTypeButton>
    </Stack>
  );
};

const RecurringTypeButton = styled.button`
  border: none;
  height: 34px;
  padding: 0 21px 0 22px;
  border-radius: 999999px;
  background: none;
  color: #fff;
  cursor: pointer;
  transition: color 200ms ease;

  &:hover {
    color: #bdb1f6;
  }

  &[data-active='true'] {
    background: #bdb1f6;
    color: #0e0e0e;
  }
`;
