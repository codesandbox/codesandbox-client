import styled, { css } from 'styled-components';
import React from 'react';

export const Title = styled.h2`
  letter-spacing: -0.025em;
  font-size: 32px;
  line-height: 38px;

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

  @media (min-width: 769px) {
    font-size: 48px;
    line-height: 56px;
  }

  @media (min-width: 1025px) {
    font-size: 64px;
    line-height: 64px;
  }
`;

export const BoxPlan = styled.a`
  scroll-snap-align: start center;

  padding: 20px 12px;
  width: 100%;
  position: relative;
  z-index: 2;
  min-width: 310px;
  margin: 0 6px;
  text-decoration: none;

  @media (min-width: 560px) {
    max-width: calc(100% / 2 - 12px);
    padding: 40px 32px;
  }

  background: #151515;
  border-top: 32px solid #2a2a2a;

  text-align: center;
  color: #808080;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease-in-out;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-8px);
    }
  }

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
    margin-bottom: 20px;

    @media (min-width: 769px) {
      margin-bottom: 64px;
    }
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

export const BoxPlanButton = styled.div`
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

  transition: background 0.2s ease;

  @media (hover: hover) {
    &:hover {
      background: rgb(55, 55, 55);
    }
  }
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
