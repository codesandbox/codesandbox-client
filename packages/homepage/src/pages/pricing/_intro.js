import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import privateIcon from './assets/private.svg';
import exportIcon from './assets/export.svg';
import priceIcon from './assets/price.svg';
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

  const [hover, setHover] = useState(false);

  const scrollViewRef = useCallback(node => {
    if (node) {
      node.scroll(window.innerWidth, 0);
    }
  }, []);

  return (
    <>
      <IntroWrapper>
        <Caption>CodeSandbox Pro</Caption>
        <Title>Everything you love about CodeSandbox, but make it Pro.</Title>

        <ScrollView>
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
                <img src={priceIcon} alt="pricing" />
              </Icon>
              <SubTitle>
                Choose between different pricing and plans to suit your needs
                and budget
              </SubTitle>
            </GridItem>
          </Grid>
        </ScrollView>
      </IntroWrapper>

      <ScrollViewPlantList>
        <Gradient className={hover ? 'hover' : ''} />
        {plans && (
          <PlanList ref={scrollViewRef}>
            {Object.entries(plans || {}).map(([plan, value]) => {
              if (plan === 'team_pro') {
                return (
                  <TeamPro
                    plan={value}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  />
                );
              }

              return <FreeBox />;
            })}
          </PlanList>
        )}
      </ScrollViewPlantList>
    </>
  );
};

/**
 * Elements
 */
const Gradient = styled.div`
  position: absolute;
  width: 1280px;
  height: 1280px;
  right: -40%;
  top: -50%;

  background: radial-gradient(
    50% 50% at 50% 50%,
    hsl(72deg 100% 82%) 0%,
    hsl(72deg 69% 76%) 3%,
    hsl(72deg 50% 71%) 6%,
    hsl(72deg 38% 65%) 9%,
    hsl(72deg 30% 59%) 12%,
    hsl(72deg 23% 54%) 15%,
    hsl(72deg 20% 48%) 19%,
    hsl(72deg 19% 43%) 22%,
    hsl(71deg 19% 38%) 26%,
    hsl(71deg 18% 32%) 30%,
    hsl(71deg 17% 27%) 34%,
    hsl(71deg 16% 23%) 39%,
    hsl(71deg 15% 18%) 44%,
    hsl(70deg 13% 13%) 51%,
    hsl(69deg 9% 9%) 59%,
    hsl(0deg 0% 4%) 77%
  );
  opacity: 0.6;
  transition: opacity 0.8s ease;

  &.hover {
    transition: opacity 0.4s ease-in;
    opacity: 1;
  }

  @media (max-width: 769px) {
    display: none;
  }
`;

const Title = styled.h1`
  letter-spacing: -0.025em;
  font-family: 'TWKEverett', sans-serif;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 0;
  font-weight: normal;

  font-size: 40px;
  line-height: 48px;

  @media (min-width: 769px) {
    font-size: 48px;
    line-height: 56px;
  }

  @media (min-width: 1025px) {
    font-size: 72px;
    line-height: 80px;
  }

  @media (min-width: 1445px) {
    font-size: 85px;
    line-height: 1.09;
  }
`;

const SubTitle = styled.h2`
  font-weight: normal;
  color: #808080;
  font-weight: normal;
  letter-spacing: -0.019em;
  margin: 0;
  margin-bottom: 0;

  font-size: 16px;
  line-height: 24px;
`;

const IntroWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Caption = styled.p`
  color: #dcff50;
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;

  font-size: 24px;
  line-height: 28px;

  @media (min-width: 769px) {
    font-size: 32px;
    line-height: 38px;
  }
`;

const ScrollView = styled.div`
  overflow: auto;
  margin-left: -1em;
  margin-right: -1em;
`;

const GridItem = styled.div`
  min-width: 220px;
  padding-right: calc(40px - 1em);
  padding-left: 1em;
`;

const Grid = styled.div`
  display: flex;
  justify-content: space-between;

  margin-top: 62px;

  @media (min-width: 376px) {
    margin-top: 72px;
  }

  @media (min-width: 769px) {
    margin-top: 96px;
  }

  ${GridItem} {
    width: calc(100% / 3);
  }
`;

const Icon = styled.div`
  background: #2a2a2a;
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  display: flex;
  margin-bottom: 24px;

  img {
    margin: auto;
    height: 22px;
  }
`;

/**
 * Plan list elements
 */

const ScrollViewPlantList = styled.div`
  margin-right: -1em;
  margin-left: -1em;
  position: relative;

  @media (min-width: 1025) {
    margin: 0;
  }
`;

const PlanList = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 0;

  scroll-snap-type: x mandatory;
  overflow-x: scroll;
  scroll-behavior: smooth;

  margin-top: 80px;
  padding: 0 1em;

  @media (min-width: 376px) {
    padding: 0;
    margin-top: 132px;
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

const FreeBox = () => {
  return (
    <BoxPlan href="/s">
      <p>For learning and experimenting</p>

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

const TeamPro = ({ plan, ...props }) => {
  if (!plan) return null;

  return (
    <BoxPlan href="/pro?type=team" pro {...props}>
      <p>Collaborate with your team Unlimited editor seats</p>

      <BoxPlanPrice
        plan="Team Pro"
        price={formatCurrent({
          currency: plan.year.currency,
          unit_amount: plan.year.unit_amount / 12,
        })}
        caption={`per editor per month, billed annually or ${formatCurrent(
          plan.month
        )}
        per month.`}
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

      <BoxPlanButton>Upgrade to Team Pro</BoxPlanButton>
    </BoxPlan>
  );
};
