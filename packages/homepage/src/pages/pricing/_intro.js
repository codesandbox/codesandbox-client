import React from 'react';
import styled, { css } from 'styled-components';

import { Title, SubTitle } from './_elements';
import privateIcon from './assets/private.svg';
import exportIcon from './assets/export.svg';
import userIcon from './assets/user.svg';
import { formatCurrent } from './_utils';

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

// {
//   pro | team_pro {
//     month | year {
//       currency: string
//       unit_amount: number
//     }
//   }
// }
export const Intro = ({ plans }) => {
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

const BoxPlan = styled.div`
  padding: 40px 32px;
  width: calc(100% / 2 - 12px);
  position: relative;
  z-index: 2;

  background: #151515;
  border-top: 32px solid #2a2a2a;

  text-align: center;
  color: #808080;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ul {
    list-style: none;
    margin: 0;
    line-height: 1;
  }

  p {
    max-width: 215px;
    margin-left: auto;
    margin-right: auto;
  }

  > *:not(:last-child) {
    margin-bottom: 64px;
  }

  ${({ pro }) => {
    return (
      pro &&
      css`
        background: #fff;
        border-top: 32px solid #edffa5;
        color: #090909;
      `
    );
  }}
`;

const BoxPlanButton = styled.a`
  display: block;
  border-radius: 4px;
  height: 56px;
  width: 100%;

  background: #090909;
  color: #fff;

  line-height: 56px;
  text-decoration: none;
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
`;

const BoxPlanPrice = styled(({ plan, price, caption, className }) => {
  return (
    <div className={className}>
      <p className="plan">{plan}</p>
      <p className="price">{price}</p>
      <p className="caption">{caption}</p>
    </div>
  );
})`
  .plan {
    font-size: 32px;
    font-family: 'TWKEverett', sans-serif;
    font-weight: 500;
    line-height: 1;
  }

  .price {
    font-size: 64px;
    font-family: 'TWKEverett', sans-serif;
    font-weight: 500;
    line-height: 1;
  }

  .caption {
    font-size: 13px;
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

      {/* TODO: link */}
      <BoxPlanButton href="/s">Upgrade to Team Pro</BoxPlanButton>
    </BoxPlan>
  );
};
