import React, { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Element,
  Icon,
  Stack,
  Text,
  Tooltip,
} from '@codesandbox/components';
import {
  CSB_FRIENDS_LINK,
  ORGANIZATION_CONTACT_LINK,
  PlanType,
  PricingPlan,
  PricingPlanFeatures,
  UBB_ENTERPRISE_FEATURES,
  UBB_ENTERPRISE_PLAN,
  UBB_FLEX_PLAN,
  UBB_FREE_FEATURES,
  UBB_FREE_PLAN,
  UBB_GROWTH_PLAN,
  UBB_PRO_FEATURES,
  UBB_STANDARD_PLAN,
} from 'app/constants';
import styled from 'styled-components';
import { useURLSearchParams } from 'app/hooks/useURLSearchParams';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { VMTier, VMType } from 'app/overmind/effects/api/types';
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
  const effects = useEffects();
  const urlWorkspaceId = getQueryParam('workspace');
  const [tiers, setTiers] = useState<VMTier[]>([]);

  const tierMap = tiers.reduce((acc: Record<VMType, VMTier>, tier) => {
    acc[tier.shortid] = tier;
    return acc;
  }, {} as Record<VMType, VMTier>);

  useEffect(() => {
    // Reset selected value in the URL when going on prev step
    removeQueryParam('plan');
  }, []);

  useEffect(() => {
    effects.api.getVMSpecs().then(res => setTiers(res.vmTiers));
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
    <AnimatedStep css={{ width: '100%' }}>
      <Stack direction="vertical" gap={64}>
        <Stack direction="vertical" gap={12}>
          <StepHeader
            onPrevStep={onPrevStep}
            onDismiss={onDismiss}
            currentStep={currentStep}
            numberOfSteps={numberOfSteps}
            title="Choose a plan"
          />

          <HorizontalScroller css={{ width: '100%' }}>
            <Stack gap={6}>
              <StyledCard
                direction="vertical"
                align="center"
                gap={8}
                css={{
                  background: '#1d1d1d',
                  color: '#e5e5e5',
                  width: '300px',
                  '@media (max-width: 1400px)': {
                    width: '260px',
                  },
                  '& a': { color: '#DCF76E' },
                }}
              >
                <CardHeading>For learning and experimenting</CardHeading>
                <PlanAndPricing plan={UBB_FREE_PLAN} />
                <PlanCredits plan={UBB_FREE_PLAN} />
                <Button
                  css={{ background: '#323232' }}
                  variant="secondary"
                  size="large"
                  onClick={onEarlyExit}
                >
                  Choose Free
                </Button>

                <PlanFeatures features={UBB_FREE_PLAN.listedFeatures} />
                <PlanVMs plan={UBB_FREE_PLAN} tierMap={tierMap} />
              </StyledCard>
              <StyledCard
                direction="vertical"
                align="center"
                gap={8}
                css={{ borderColor: '#9D8BF9' }}
              >
                <CardHeading>
                  Pay as you go with a monthly subscription
                </CardHeading>
                <Element
                  css={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '32px',
                    '@media (max-width: 1400px)': {
                      gap: '24px',
                    },
                  }}
                >
                  <Stack direction="vertical" gap={8} align="center">
                    <PlanAndPricing plan={UBB_FLEX_PLAN} />
                    <PlanCredits plan={UBB_FLEX_PLAN} />
                    <Button
                      variant="dark"
                      size="large"
                      onClick={() => handleChoosePlan('flex')}
                    >
                      Choose Pro Flex
                    </Button>
                    <PlanFeatures features={UBB_FLEX_PLAN.listedFeatures} />
                  </Stack>
                  <Stack direction="vertical" gap={8} align="center">
                    <PlanAndPricing plan={UBB_STANDARD_PLAN} />
                    <PlanCredits plan={UBB_STANDARD_PLAN} />
                    <Button
                      variant="dark"
                      size="large"
                      onClick={() => handleChoosePlan('standard')}
                    >
                      Choose Pro Standard
                    </Button>
                    <PlanFeatures features={UBB_STANDARD_PLAN.listedFeatures} />
                  </Stack>
                  <Stack direction="vertical" gap={8} align="center">
                    <PlanAndPricing plan={UBB_GROWTH_PLAN} />
                    <PlanCredits plan={UBB_GROWTH_PLAN} />
                    <Button
                      variant="dark"
                      size="large"
                      onClick={() => handleChoosePlan('growth')}
                    >
                      Choose Pro Growth
                    </Button>
                    <PlanFeatures features={UBB_GROWTH_PLAN.listedFeatures} />
                  </Stack>
                </Element>

                <Element
                  css={{ background: '#DBDBDB', width: '100%', height: '1px' }}
                />

                <PlanFeatures
                  features={[
                    'Add-ons available:',
                    '+50 Sandboxes for $9 per month',
                    '+20 GB storage for $12 per month',
                  ]}
                />

                <PlanFeatures
                  features={['Unlimited Devboxes and repositories']}
                />

                <PlanVMs plan={UBB_STANDARD_PLAN} tierMap={tierMap} />
              </StyledCard>
              <StyledCard
                direction="vertical"
                align="center"
                gap={8}
                css={{
                  borderColor: '#DCF76E',
                  width: '300px',
                  '@media (max-width: 1400px)': {
                    width: '260px',
                  },
                }}
              >
                <CardHeading>
                  The future of Cloud Development Environments
                </CardHeading>
                <PlanAndPricing plan={UBB_ENTERPRISE_PLAN} />
                <PlanCredits plan={UBB_ENTERPRISE_PLAN} />
                <Button
                  as="a"
                  href={ORGANIZATION_CONTACT_LINK}
                  variant="dark"
                  size="large"
                >
                  Contact us
                </Button>
                <Stack direction="vertical" gap={6}>
                  <Text>Everything in Pro, plus:</Text>

                  <PlanFeatures features={UBB_ENTERPRISE_PLAN.listedFeatures} />
                </Stack>

                <PlanVMs plan={UBB_ENTERPRISE_PLAN} tierMap={tierMap} />
              </StyledCard>
            </Stack>
          </HorizontalScroller>
          <CodeSandboxFriendsCard />
        </Stack>
        <FeaturesComparison
          plans={[UBB_FREE_FEATURES, UBB_PRO_FEATURES, UBB_ENTERPRISE_FEATURES]}
        />
        <VMSpecs tiers={tiers} />

        {/* <FAQ
          content={[
            {
              question: 'What is the free plan?',
              answer: 'The free plan is free for 30 days.',
            },
            {
              question: 'What are the benefits of the free plan?',
              answer: 'The free plan is free for 30 days.',
            },
            {
              question: 'What is the free plan?',
              answer: 'The free plan is free for 30 days.',
            },
          ]}
        /> */}
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
  height: 80px;
  width: 100%;
  max-width: 250px;
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
  height: 100px;
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

const PlanAndPricing: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const isPro = plan.id !== 'free' && plan.id !== 'enterprise';

  return (
    <Stack direction="vertical" align="center" gap={2}>
      <Stack direction="vertical" align="center">
        {isPro ? (
          <Text size={7} fontFamily="everett" weight="medium">
            Pro
          </Text>
        ) : (
          <Element css={{ height: 37 }} />
        )}

        <Text size={7} fontFamily="everett" weight="medium">
          {plan.name}
        </Text>
      </Stack>
      <Element css={{ position: 'relative' }}>
        <Text size={9} fontFamily="everett" weight="medium">
          {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
        </Text>

        {plan.priceDiscountNote && (
          <Element css={{ position: 'absolute', top: 6, right: -6, width: 0 }}>
            <Text
              size={2}
              css={{
                padding: '6px 8px',
                borderRadius: 4,
                display: 'block',
                backgroundColor: plan.id === 'flex' ? '#DCF76E' : '#9D8BF9',
                color: plan.id === 'flex' ? 'inherit' : '#fff',
                width: plan.id === 'flex' ? 90 : 47,
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

const PlanCredits: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
  <Stack direction="vertical" align="center" css={{ height: '35px' }}>
    {plan.credits > 0 &&
      (plan.creditsNote ? (
        <Tooltip label={plan.creditsNote}>
          <Text
            css={{
              borderBottom: '1px dotted currentColor',
              marginBottom: '5px !important',
            }}
          >
            {plan.credits} credits included
          </Text>
        </Tooltip>
      ) : (
        <Text>{plan.credits} credits included</Text>
      ))}
    {plan.additionalCreditsCost ? (
      <Text size={2} color="#4E3BB0" css={{ textAlign: 'center' }}>
        Need more? ${plan.additionalCreditsCost} $/cr
      </Text>
    ) : null}
  </Stack>
);

const PlanFeatures: React.FC<{ features: string[] }> = ({ features }) => (
  <Stack direction="vertical" align="center">
    {features.map(feature => (
      <Text key={feature}>{feature}</Text>
    ))}
  </Stack>
);

const PlanVMs: React.FC<{
  plan: PricingPlan;
  tierMap: Record<VMType, VMTier>;
}> = ({ plan, tierMap }) => (
  <Stack direction="vertical" align="center" css={{ height: '60px' }}>
    <Text>Virtual machines up to:</Text>
    <Text
      css={{
        textAlign: 'center',
        opacity: Object.keys(tierMap).length === 0 ? 0 : 1,
        transition: 'opacity 0.15s ease-out',
      }}
    >
      {Object.keys(tierMap).length > 0 && (
        <>
          {tierMap[plan.highestVM].cpu} vCPUs + {tierMap[plan.highestVM].memory}{' '}
          GB RAM
        </>
      )}
    </Text>
  </Stack>
);

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

// const FAQ: React.FC<{
//   content: Array<{ question: string; answer: string }>;
// }> = ({ content }) => {
//   return (
//     <Stack>
//       <Element>
//         <Text as="h2">Frequently asked questions</Text>
//       </Element>

//       <Element>
//         {content.map((faq, index) => (
//           <FaqItem
//             open={index === 0}
//             key={index}
//             question={faq.question}
//             answer={faq.answer}
//           />
//         ))}
//       </Element>
//     </Stack>
//   );
// };

// const FaqItem = ({ question, answer, open }) => {
//   const [isOpen, setIsOpen] = useState(open);

//   const toggleOpen = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <FaqContainer open={isOpen}>
//       <Question size={24} onClick={toggleOpen}>
//         {question}

//         <svg
//           width="24"
//           height="25"
//           viewBox="0 0 24 25"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             d="M5.96967 1.96967C6.26256 1.67678 6.73744 1.67678 7.03033 1.96967L16.5 11.4393C17.0858 12.0251 17.0858 12.9749 16.5 13.5607L7.03033 23.0303C6.73744 23.3232 6.26256 23.3232 5.96967 23.0303C5.67678 22.7375 5.67678 22.2626 5.96967 21.9697L15.4394 12.5L5.96967 3.03033C5.67678 2.73744 5.67678 2.26256 5.96967 1.96967Z"
//             fill="black"
//           />
//         </svg>
//       </Question>

//       {isOpen && (
//         <Element css={{ padding: '0 $3 $4 $3' }}>
//           {answer.split('\n').map((line, index) => {
//             return (
//               <Text key={index} as="p" size={18} css={{ color: '$neutral100' }}>
//                 {line}
//               </Text>
//             );
//           })}
//         </Element>
//       )}
//     </FaqContainer>
//   );
// };

// const FaqContainer = styled('div')`
//   display: flex;

//   border-top: 1px solid $neutral500;

//   svg {
//     transform: rotate(90deg) translate3D(6px, 0, 0);
//     transition: transform 150ms ease-in-out;
//   }

//   .open-true svg {
//     transform: rotate(-90deg);
//   }

//   &:last-child {
//     border-bottom: 1px solid $neutral500;
//   }
// `;

// const Question = styled('button')`
//   text-align: left;
//   font-size: 24px;
//   padding: 24px 16px;
//   background: none;
//   border: none;
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   cursor: pointer;
//   transition: background 150ms ease-in-out;
//   color: inherit;
// `;
