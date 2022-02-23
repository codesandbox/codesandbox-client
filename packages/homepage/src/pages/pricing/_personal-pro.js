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
  return (
    <>
      <GridItem css={{ marginBottom: 88 }}>
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

            <a href="#plans">
              <img src={arrowForwardIcon} alt="scroll to plans" />
              <span>Compare our plans</span>
            </a>
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

            {/* TODO: link */}
            <BoxPlanButton href="/s">Upgrade to Personal Pro</BoxPlanButton>
          </BoxPlan>
        )}
      </Grid>
    </>
  );
};

/**
 * Elements
 */
const Grid = styled.div`
  display: flex;
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

    background: radial-gradient(50% 50% at 50% 50%, #2c2554 0%, #090909 60.35%);

    opacity: 1;
  }
`;

const GridItem = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
`;

const Content = styled.div`
  font-size: 24px;

  p {
    margin-bottom: 1.8em;
  }

  ul {
    margin-left: 1.27em;
  }

  a {
    color: #ac9cff;
    text-decoration: none;
    margin-top: 2.6em;
    display: flex;

    img {
      margin-right: 0.4em;
    }
  }
`;
