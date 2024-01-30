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
import {
  CSB_FRIENDS_LINK,
  ORGANIZATION_CONTACT_LINK,
  PricingPlan,
  PricingPlanFeatures,
  UBB_ENTERPRISE_FEATURES,
  UBB_ENTERPRISE_PLAN,
  UBB_PRO_FEATURES,
  UBB_PRO_PLAN,
  UBB_FREE_FEATURES,
  UBB_FREE_PLAN,
  EXPLAINED_FEATURES,
} from 'app/constants';
import styled from 'styled-components';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { VMTier } from 'app/overmind/effects/api/types';
import { useLocation } from 'react-router-dom';
import { useWorkspaceFeatureFlags } from 'app/hooks/useWorkspaceFeatureFlags';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { StepProps } from '../types';
import { StepHeader } from '../StepHeader';
import { AnimatedStep } from '../elements';
import { FAQ } from './FAQ';

export const Plans: React.FC<StepProps> = ({
  onNextStep,
  onEarlyExit,
  onPrevStep,
  onDismiss,
  currentStep,
  numberOfSteps,
}) => {
  const { getQueryParam } = useURLSearchParams();
  const { activeTeam } = useAppState();

  const actions = useActions();
  const effects = useEffects();
  const urlWorkspaceId = getQueryParam('workspace');
  const { pathname } = useLocation();
  const [tiers, setTiers] = useState<VMTier[]>([]);
  const { ubbBeta } = useWorkspaceFeatureFlags();
  const { isFree } = useWorkspaceSubscription();
  const isUpgrading = pathname.includes('upgrade');
  const shouldToggleUbbFlag = !ubbBeta && isFree;

  // Until the 30th of Jan existing Pro can see this page
  // However, they should not see the free plan
  const showFreePlan = isFree;

  // For new workspaces
  let freeButtonCTA = 'Get started for free';

  if (isUpgrading) {
    if (ubbBeta) {
      // For free workspaces, early exit, no upgrade
      freeButtonCTA = 'Continue on Free';
    } else {
      // For workspaces converting from old free
      freeButtonCTA = 'Choose Free';
    }
  }

  useEffect(() => {
    effects.api.getVMSpecs().then(res => setTiers(res.vmTiers));
  }, []);

  useEffect(() => {
    if (activeTeam !== urlWorkspaceId) {
      actions.setActiveTeam({ id: urlWorkspaceId });
    }
  }, [urlWorkspaceId, activeTeam, actions]);

  const handleProPlanSelection = async () => {
    if (shouldToggleUbbFlag) {
      await effects.gql.mutations.joinUsageBillingBeta({
        teamId: urlWorkspaceId,
      });
    }

    actions.checkout.selectPlan(UBB_PRO_PLAN);

    onNextStep();
  };

  return (
    <AnimatedStep css={{ width: '100%' }}>
      <Stack
        direction="vertical"
        gap={64}
        css={{ maxWidth: '1188px', margin: 'auto', paddingBottom: 120 }}
      >
        <StepHeader
          onPrevStep={onPrevStep}
          onDismiss={onDismiss}
          currentStep={currentStep}
          numberOfSteps={numberOfSteps}
          title="Choose a plan"
        />

        <Stack gap={4} direction="vertical">
          <HorizontalScroller css={{ width: '100%' }}>
            <Stack gap={6} justify="center">
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
                    {UBB_FREE_PLAN.name}
                  </Text>
                  <CardHeading>For learning and experimenting</CardHeading>
                  <PlanPricing plan={UBB_FREE_PLAN} />

                  <Button
                    css={{
                      background: '#F0F0F0',
                      '&:hover': { backgroundColor: '#fff' },
                    }}
                    size="large"
                    onClick={async () => {
                      if (shouldToggleUbbFlag) {
                        await effects.gql.mutations.joinUsageBillingBeta({
                          teamId: urlWorkspaceId,
                        });
                      }

                      // Full reload
                      onEarlyExit(shouldToggleUbbFlag);
                    }}
                  >
                    {freeButtonCTA}
                  </Button>

                  <PlanFeatures
                    heading="Usage"
                    secondaryColor="#a6a6a6"
                    features={UBB_FREE_PLAN.usage}
                    includeTooltips
                  />
                  <PlanFeatures
                    heading="Features"
                    secondaryColor="#a6a6a6"
                    features={UBB_FREE_PLAN.features}
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
                  {UBB_PRO_PLAN.name}
                </Text>
                <CardHeading>
                  Pay as you go with a monthly subscription
                </CardHeading>
                <PlanPricing plan={UBB_PRO_PLAN} />
                <Button
                  variant="dark"
                  css={{
                    background: '#644ED7',
                    '&:hover': { background: '#7B61FF' },
                  }}
                  size="large"
                  onClick={handleProPlanSelection}
                >
                  Build your Pro plan
                </Button>
                <PlanFeatures
                  heading="Usage"
                  features={UBB_PRO_PLAN.usage}
                  includeTooltips
                />
                <PlanFeatures
                  heading="Features"
                  features={UBB_PRO_PLAN.features}
                />
                <PlanFeatures
                  itemIcon="plus"
                  heading="Add-ons"
                  features={['More VM credits', 'More Sandboxes']}
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
                  {UBB_ENTERPRISE_PLAN.name}
                </Text>
                <CardHeading>
                  The future of Cloud Development Environments
                </CardHeading>
                <PlanPricing
                  plan={UBB_ENTERPRISE_PLAN}
                  overridePrice="Custom"
                />
                <Button
                  as="a"
                  href={ORGANIZATION_CONTACT_LINK}
                  variant="primary"
                  size="large"
                  target="_blank"
                  style={{ backgroundColor: '#DCFF50' }}
                >
                  Contact us
                </Button>
                <Stack direction="vertical" gap={4}>
                  <Text>Everything in Pro, plus:</Text>
                  <PlanFeatures features={UBB_ENTERPRISE_PLAN.features} />
                </Stack>
              </StyledCard>
            </Stack>
          </HorizontalScroller>
          <CodeSandboxFriendsCard />
        </Stack>
        <FeaturesComparison
          plans={[UBB_FREE_FEATURES, UBB_PRO_FEATURES, UBB_ENTERPRISE_FEATURES]}
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
  width: 380px;

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

const PlanPricing: React.FC<{ plan: PricingPlan; overridePrice?: string }> = ({
  plan,
  overridePrice,
}) => {
  const isPro = plan.id === 'flex';

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
          {overridePrice || `$${plan.price}`}
        </Text>

        {plan.priceDiscountNote && (
          <Element css={{ position: 'absolute', top: 6, right: -6, width: 0 }}>
            <Text
              size={2}
              css={{
                padding: '6px 8px',
                borderRadius: 4,
                display: 'block',
                backgroundColor: '#DCF76E',
                color: 'inherit',
                width: 90,
              }}
            >
              {plan.priceDiscountNote}
            </Text>
          </Element>
        )}
      </Element>

      {(plan.id === 'free' || plan.id === 'enterprise') && (
        <Element css={{ height: '40px' }} />
      )}
      {isPro && (
        <Text align="center" weight="medium">
          per month
          <br />
          per workspace
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
        Discounts for open source and non-profits
      </Text>
      <Text css={{ textWrap: 'balance' }}>
        Remove limits and get free or low-cost access to CodeSandbox if
        you&apos;re working on licensed open-source software, developer
        community projects or for non-profit organizations.{' '}
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
          gridTemplateColumns: `repeat(4, 1fr)`,
          '& > *:not(:nth-child(-n+4))': {
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
          title="Storage"
          description="The maximum amount of storage space available."
          plans={plans}
          property="storage"
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
          title="Personal drafts"
          description="The maximum number of Sandbox drafts (not shareable or embeddable) per workspace user."
          plans={plans}
          property="drafts"
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
                href="https://codesandbox.io/docs/learn/devboxes/editors?tab=devbox"
              >
                Learn more about Devboxes.
              </a>
            </>
          }
          plans={plans}
          property="devboxes"
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
