import React from 'react';
import styled from 'styled-components';

import { formatCurrent } from './_utils';
import { Title, BoxPlan, BoxPlanButton, BoxPlanPrice } from './_elements';
import arrowForwardIcon from './assets/arrowForward.svg';

export const PersonalPro = ({ plans }) => {
  // plans: {
  //   pro | team_pro {
  //     month | year {
  //       currency: string
  //       unit_amount: number
  //     }
  //   }
  // }
  const scrollTo = event => {
    event.preventDefault();

    const element = document.querySelector('#plans');
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 120;

    if (element) {
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <GridItem
        css={{
          marginBottom: 32,
          '@media (min-width: 769px)': { marginBottom: 88 },
        }}
      >
        <Title>Power users and freelancers, we got you too.</Title>
      </GridItem>

      <Grid>
        <GridItem>
          <Content>
            <p>All free features, plus:</p>

            <ul>
              <li>Private sandboxes</li>
              <li>Private GitHub repos</li>
              <li>More storage space</li>
              <li>Higher upload limits</li>
              <li>Stricter sandbox permissions</li>
            </ul>

            <CompareLink
              href="#plans"
              onClick={scrollTo}
              css={{
                display: 'none',
                '@media (min-width: 560px)': { display: 'flex' },
              }}
            >
              <img src={arrowForwardIcon} width="16" alt="scroll to plans" />
              <span>Compare our plans</span>
            </CompareLink>
          </Content>
        </GridItem>

        {plans && (
          <BoxPlan personalPro>
            <p>Exclusive for personal teams 1 editor</p>

            <BoxPlanPrice
              plan="Personal Pro"
              price={formatCurrent({
                currency: plans.pro.year.currency,
                unit_amount: plans.pro.year.unit_amount / 12,
              })}
              caption={`per month, billed annually or ${formatCurrent(
                plans.pro.month
              )}
          month-on-month.`}
            />

            <BoxPlanButton href="#upgrade">
              Upgrade to Personal Pro
            </BoxPlanButton>
          </BoxPlan>
        )}

        <CompareLink
          href="#plans"
          onClick={scrollTo}
          css={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            '@media (min-width: 560px)': { display: 'none' },
          }}
        >
          <img src={arrowForwardIcon} width="16" alt="scroll to plans" />
          <span>Compare our plans</span>
        </CompareLink>
      </Grid>
    </>
  );
};

/**
 * Elements
 */
const Grid = styled.div`
  position: relative;
  z-index: 0;

  @media (min-width: 560px) {
    display: flex;
  }

  &:after {
    content: '';

    position: absolute;
    width: 1280px;
    height: 1280px;
    right: calc(-1280px / 3);
    top: calc(-1280px / 4);
    z-index: 0;

    background: radial-gradient(50% 50% at 50% 50%, #7b61ff 20%, #090909 100%);
    opacity: 0.2;
    display: none;
    transition: all 1s ease;

    @media (min-width: 1025px) {
      display: block;
    }
  }

  @media (hover: hover) {
    &:hover:after {
      opacity: 0.8;
    }
  }
`;

const GridItem = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  margin-bottom: 40px;

  @media (min-width: 560px) {
    margin-bottom: 0;
  }
`;

const Content = styled.div`
  font-size: 16px;
  line-height: 24px;

  @media (min-width: 769px) {
    font-size: 24px;
    line-height: 32px;
  }

  p {
    margin-bottom: 1.8em;
    font-weight: normal;
  }

  ul {
    margin-left: 1.27em;
  }

  li {
    margin: 0;
    font-weight: normal;
  }
`;

const CompareLink = styled.a`
  color: #ac9cff;
  text-decoration: none;
  margin-top: 2.6em;
  display: flex;

  font-size: 16px;
  line-height: 24px;

  @media (min-width: 769px) {
    font-size: 24px;
    line-height: 32px;
  }

  @media (hover: hover) {
    &:hover img {
      transform: translateY(4px);
    }
  }

  img {
    transition: all 0.2s ease;
    margin-right: 0.4em;
  }
`;
