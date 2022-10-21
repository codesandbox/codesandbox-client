import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

import usePrefersReducedMotion from '../../utils/isReducedMOtion';

import {
  BoxPlan,
  BoxPlanButton,
  BoxPlanList,
  BoxPlanPrice,
  Caption,
  ComparePlansLink,
} from './_elements';
import { formatCurrency } from './_utils';

/**
 * Main component
 */
export const Intro = ({
  plans = {
    team_pro: {
      month: {
        currency: '$',
        unit_amount: 5,
      },
      year: {
        currency: '$',
        unit_amount: 5,
      },
    },
    pro: {
      month: {
        currency: '$',
        unit_amount: 5,
      },
      year: {
        currency: '$',
        unit_amount: 5,
      },
    },
  },
}) => {
  // plans: {
  //   pro | team_pro {
  //     month | year {
  //       currency: string
  //       unit_amount: number
  //     }
  //   }
  // }

  const shouldReduceMotion = usePrefersReducedMotion();

  const [teamHover, setTeamHover] = useState(false);
  const [personalHover, setPersonalHover] = useState(false);

  const scrollViewRef = useCallback(node => {
    if (node) {
      node.scroll(window.innerWidth, 0);
    }
  }, []);

  const scrollTo = (event, elementId) => {
    event.preventDefault();

    const element = document.querySelector(elementId);
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 120;

    if (element) {
      window.scrollTo({
        top: offsetPosition,
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <>
      <IntroWrapper>
        <Caption
          css={{
            color: '#dcff50',
          }}
        >
          Pricing
        </Caption>
        <Title>
          Free to learn and experiment.
          <br />
          Pay as you grow.
        </Title>
      </IntroWrapper>

      {plans && (
        <>
          <PlansWrapper>
            <PlansTitle>Team and Business Plans</PlansTitle>
            <ScrollViewPlansList>
              <Gradient className={teamHover ? 'hover' : ''} teamSection />
              <PlanList ref={scrollViewRef}>
                <TeamFree />
                {plans.team_pro ? (
                  <TeamPro
                    plan={plans.team_pro}
                    onMouseEnter={() => setTeamHover(true)}
                    onMouseLeave={() => setTeamHover(false)}
                  />
                ) : null}
                <OrgCustom
                  // TODO: verify if another effect should be applied.
                  onMouseEnter={() => setTeamHover(true)}
                  onMouseLeave={() => setTeamHover(false)}
                />
              </PlanList>
            </ScrollViewPlansList>
            <ComparePlansLinkWrapper>
              <ComparePlansLink scrollTo={e => scrollTo(e, '#team-plans')} />
            </ComparePlansLinkWrapper>
          </PlansWrapper>

          <PlansWrapper>
            <PlansTitle>Personal Plans</PlansTitle>
            <ScrollViewPlansList>
              <Gradient
                className={personalHover ? 'hover' : ''}
                personalSection
              />
              {plans && (
                <PlanList ref={scrollViewRef}>
                  <PersonalFree />
                  {plans.pro ? (
                    <PersonalPro
                      plan={plans.pro}
                      onMouseEnter={() => setPersonalHover(true)}
                      onMouseLeave={() => setPersonalHover(false)}
                    />
                  ) : null}
                </PlanList>
              )}
            </ScrollViewPlansList>
            <ComparePlansLinkWrapper>
              <ComparePlansLink
                scrollTo={e => scrollTo(e, '#personal-plans')}
              />
            </ComparePlansLinkWrapper>
          </PlansWrapper>
        </>
      )}
    </>
  );
};

/**
 * Hero elements
 */
const IntroWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-family: 'TWKEverett', sans-serif;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 0;
  font-weight: normal;

  letter-spacing: -0.025em;
  font-size: 40px;
  line-height: 1.1;

  @media (min-width: 769px) {
    font-size: 48px;
  }

  @media (min-width: 1025px) {
    letter-spacing: -0.03em;
    font-weight: 500;
    font-size: 64px;
  }
`;

/**
 * Plan list elements
 */
const Gradient = styled.div`
  position: absolute;
  width: 1280px;
  height: 1280px;
  right: -40%;
  top: -50%;
  /* background: radial-gradient(
    61.76% 61.76% at 50% 38.24%,
    #ac9cff 0%,
    #000000 60.35%
  ); */
  opacity: 0.6;
  transition: opacity 0.8s ease;

  &.hover {
    transition: opacity 0.4s ease-in;
    opacity: 1;
  }

  @media (max-width: 768px) {
    display: none;
  }

  ${({ teamSection }) => {
    return (
      teamSection &&
      css`
        background: radial-gradient(
          61.76% 61.76% at 50% 38.24%,
          #edffa5 0%,
          #000000 60.35%
        );
      `
    );
  }}

  ${({ personalSection }) => {
    return (
      personalSection &&
      css`
        background: radial-gradient(
          61.76% 61.76% at 50% 38.24%,
          #ac9cff 0%,
          #000000 60.35%
        );
      `
    );
  }}
`;

const PlansWrapper = styled.div`
  margin-top: 100px; // TODO: verify if spacing is correct

  @media (min-width: 769px) {
    margin-top: 150px;
  }
`;

const PlansTitle = styled.h2`
  position: relative;
  z-index: 1;
  margin-bottom: 0;

  color: #ffffff;

  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
  font-size: 32px;
  line-height: 42px;
  letter-spacing: -0.01em;
`;

const ScrollViewPlansList = styled.div`
  margin-right: -1em;
  margin-left: -1em;
  position: relative;

  @media (min-width: 1025px) {
    margin: 0;
  }
`;

const PlanList = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  scroll-behavior: smooth;

  margin-top: 80px; // TODO: verify if spacing is correct
  padding: 0 1em;

  @media (min-width: 376px) {
    padding: 0;
    margin-top: 100px;
  }

  @media (min-width: 1025px) {
    overflow: visible;
  }

  @media (hover: hover) {
    &:hover:after {
      opacity: 0.5;
    }
  }
`;

const ComparePlansLinkWrapper = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const TeamFree = () => {
  return (
    <BoxPlan href="/s">
      <p>For learning and experimenting</p>

      <BoxPlanPrice plan="Free" price="$0" caption="forever" />

      <BoxPlanList>
        <li>5 editors</li>
        <li>20 public sandboxes</li>
        <li>3 public repositories</li>
        <li>All platform features</li>
        <li>Team dashboard</li>

        {/* Visually aligned */}
        <br />
        <br />

        <li>4GB RAM</li>
        <li>2vCPUs</li>
        <li>4GB Disk</li>
      </BoxPlanList>

      <BoxPlanButton href="/s">Start coding now</BoxPlanButton>
    </BoxPlan>
  );
};

const TeamPro = ({ plan, ...props }) => {
  if (!plan) return null;

  return (
    <BoxPlan href="/pro?type=team" teamPro {...props}>
      <p>For small teams focused on collaboration</p>

      <BoxPlanPrice
        plan="Team Pro"
        price={formatCurrency({
          currency: plan.year.currency,
          unit_amount: plan.year.unit_amount / 12,
        })}
        caption={`per editor per month, billed annually or ${formatCurrency(
          plan.month
        )}
        per month.`}
      />

      <BoxPlanList>
        <li>20 editors</li>
        <li>Unlimited sandboxes</li>
        <li>Unlimited repositories</li>
        <li>Private NPM packages</li>
        <li>Advanced permissions</li>

        {/* Visually aligned */}
        <br />
        <br />

        <li>6GB RAM</li>
        <li>4vCPUs</li>
        <li>12GB Disk</li>
      </BoxPlanList>

      <BoxPlanButton>Upgrade to Team Pro</BoxPlanButton>
    </BoxPlan>
  );
};

const OrgCustom = props => {
  return (
    <BoxPlan
      href="https://codesandbox.typeform.com/organization"
      target="_blank"
      rel="noopener noreferrer"
      orgCustom
      {...props}
    >
      <p>For companies that want to go beyond</p>

      <BoxPlanPrice
        plan="Organization"
        price="Custom"
        caption="tailor-made plan with more flexibility."
        customPrice
      />

      <BoxPlanList>
        <li>All Team Pro features, plus:</li>
        <li>20+ editors (no limit)</li>
        <li>Bulk pricing for seats</li>
        <li>Custom VM Specs</li>
        <li>Custom support</li>
        <li>Shared Slack channel</li>
        <li>Customer success manager </li>
      </BoxPlanList>

      <BoxPlanButton>Contact us</BoxPlanButton>
    </BoxPlan>
  );
};

const PersonalFree = () => {
  return (
    <BoxPlan href="/s">
      <p>For learning and experimenting</p>

      <BoxPlanPrice plan="Free" price="$0" caption="forever" />

      <BoxPlanList>
        <li>Free for individuals</li>
        <li>All platform features</li>
        <li>Unlimited public sandboxes</li>
        <li>Unlimited public repositories</li>
        <li>Personal dashboard</li>

        {/* Visually aligned */}
        <br />
        <br />

        <li>4GB RAM</li>
        <li>2vCPUs</li>
        <li>4GB Disk</li>
      </BoxPlanList>

      <BoxPlanButton href="/s">Start coding now</BoxPlanButton>
    </BoxPlan>
  );
};

const PersonalPro = ({ plan, ...props }) => {
  return (
    <BoxPlan personalPro href="/pro?type=personal" {...props}>
      <p>For power users and freelancers</p>

      <BoxPlanPrice
        plan="Personal Pro"
        price={formatCurrency({
          currency: plan.year.currency,
          unit_amount: plan.year.unit_amount / 12,
        })}
        caption={`per month, billed annually or ${formatCurrency(plan.month)}
      per month.`}
      />

      <BoxPlanList>
        <li>All Free features, plus:</li>
        <li>Unlimited private sandboxes</li>
        <li>Unlimited private repositories</li>
        <li>Advanced permissions</li>

        {/* Visually aligned */}
        <br />
        <br />
        <br />
        <br />

        <li>6GB RAM</li>
        <li>4vCPUs</li>
        <li>12GB Disk</li>
      </BoxPlanList>

      <BoxPlanButton>Upgrade to Personal Pro</BoxPlanButton>
    </BoxPlan>
  );
};
