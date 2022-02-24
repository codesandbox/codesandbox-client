import styled, { css } from 'styled-components';
import React from 'react';

export const Title = styled.h2`
  font-size: 64px;
  line-height: 64px;
  letter-spacing: -0.025em;

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;

  font-family: 'TWKEverett', sans-serif;
  font-weight: normal;

  a {
    text-decoration: none;
    color: #edffa5;
  }
`;

export const BoxPlan = styled.div`
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
    font-size: 16px;
    line-height: 24px;
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

  ${({ personalPro }) => {
    return (
      personalPro &&
      css`
        background: #fff;
        border-top: 32px solid #ac9cff;
        color: #090909;
      `
    );
  }}
`;

export const BoxPlanButton = styled.a`
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

export const BoxPlanPrice = styled(({ plan, price, caption, className }) => {
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
    line-height: 16px;
  }
`;
