import React from 'react';
import styled from 'styled-components';

import privateIcon from './assets/private.svg';
import exportIcon from './assets/export.svg';
import userIcon from './assets/user.svg';
import { formatCurrent } from './_utils';
import { BoxPlan, BoxPlanButton, BoxPlanPrice } from './_elements';

/**
 * Main component
 */
export const Intro = ({ plans }) => {
  // plans: {
  //   pro | team_pro {
  //     month | year {
  //       currency: string
  //       unit_amount: number
  //     }
  //   }
  // }

  return (
    <>
      <IntroWrapper>
        <Caption>CodeSandbox Pro</Caption>
        <Title>Everything you love about CodeSandbox, but make it Pro</Title>

        <Grid>
          <GridItem>
            <Icon>
              <img src={privateIcon} alt="private npm packages" />
            </Icon>
            <SubTitle>
              Use private NPM packages and manage advanced permissions options
            </SubTitle>
          </GridItem>

          <GridItem>
            <Icon>
              <img src={exportIcon} alt="storage" />
            </Icon>
            <SubTitle>
              Go bigger and bolder with 500MB of storage and 30MB upload speed
            </SubTitle>
          </GridItem>

          <GridItem>
            <Icon>
              <img src={userIcon} alt="pricing" />
            </Icon>
            <SubTitle>
              Choose between different pricing and plans to suit your needs and
              budget
            </SubTitle>
          </GridItem>
        </Grid>
      </IntroWrapper>

      {plans && (
        <PlanList>
          {Object.entries(plans || {}).map(([plan, value]) => {
            if (plan === 'team_pro') {
              return <TeamPro plan={value} />;
            }

            return <FreeBox />;
          })}
        </PlanList>
      )}
    </>
  );
};

/**
 * Elements
 */
const Title = styled.h1`
  font-size: 85px;
  letter-spacing: -0.025em;
  line-height: 1.09;
  font-family: ${props => props.theme.homepage.appleFont};
  font-family: 'TWKEverett', sans-serif;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  font-weight: normal;
  padding-right: 10%;

  ${props => props.theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 1.2;
    padding-right: 0;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 2rem;
  }
`;

const SubTitle = styled.h2`
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.muted};
  margin: 0;
  margin-bottom: 1rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;

const IntroWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Caption = styled.p`
  color: #dcff50;
  font-size: 32px;
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
`;

const GridItem = styled.div``;

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 96px;

  ${GridItem} {
    width: calc(100% / 3 - 5.4em);
  }
`;

const Icon = styled.div`
  background: #191919;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  display: flex;
  margin-bottom: 24px;

  img {
    margin: auto;
  }
`;

/**
 * Plan list elements
 */
const PlanList = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 132px;
  position: relative;
  z-index: 0;

  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 1280px;
    height: 1280px;
    right: calc(-1280px / 3);
    top: calc(-1280px / 3);
    z-index: 0;

    background: radial-gradient(
      50% 50% at 50% 50%,
      rgba(237, 255, 165, 0.3) 0%,
      #090909 60.35%
    );
    opacity: 1;
  }
`;

const FreeBox = () => {
  return (
    <BoxPlan>
      <p>For learning and experimenting.</p>

      <BoxPlanPrice plan="Free" price="$0" caption="forever" />
      <ul>
        {/* Visually aligned */}
        <br />
        <br />

        <li>Free for individuals</li>
        <li>All Platform features</li>
        <li>Public sandboxes</li>
        <li>Personal dashboard</li>

        {/* Visually aligned */}
        <br />
        <br />
      </ul>

      <BoxPlanButton href="/s">Start using now</BoxPlanButton>
    </BoxPlan>
  );
};

const TeamPro = ({ plan }) => {
  if (!plan) return null;

  return (
    <BoxPlan pro>
      <p>Collaborate with your team Unlimited editor seats.</p>

      <BoxPlanPrice
        plan="Team Pro"
        price={formatCurrent({
          currency: plan.year.currency,
          unit_amount: plan.year.unit_amount / 12,
        })}
        caption={`per editor per month, billed annually or ${formatCurrent(
          plan.month
        )}
          month-on-month.`}
      />

      <ul>
        <li>All free features, plus:</li>
        <li>Private sandboxes</li>
        <li>Private GitHub repos</li>
        <li>Private NPM packages</li>
        <li>Advanced permissions</li>
        <li>Unlimited viewers and editors</li>
        <li>Centralized billing</li>
      </ul>

      <BoxPlanButton href="#upgrade">Upgrade to Team Pro</BoxPlanButton>
    </BoxPlan>
  );
};
