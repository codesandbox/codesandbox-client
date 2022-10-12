import styled, { css } from 'styled-components';
import React from 'react';

import doubleArrowDown from './assets/doubleArrowDown.svg';

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

  padding: 24px;
  width: 100%;
  position: relative;
  z-index: 2;
  min-width: 310px;
  margin: 0 6px;
  text-decoration: none;

  background: #242424;
  border-top: 24px solid #373737;

  text-align: center;
  color: #808080;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease-in-out;

  @media (min-width: 769px) {
    max-width: calc(100% / 2 - 12px);
    padding: 40px 32px;
    border-top-width: 32px;
  }

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

  p,
  li {
    max-width: 185px;
    margin-left: auto;
    margin-right: auto;
    font-size: 13px;
    line-height: 18px;
    margin-bottom: 0;

    @media (min-width: 769px) {
      max-width: 220px;
      font-size: 16px;
      line-height: 24px;
    }
  }

  li {
    margin-bottom: 0.3em;
  }

  > *:not(:last-child) {
    margin-bottom: 32px;

    @media (min-width: 769px) {
      margin-bottom: 64px;
    }
  }

  ${({ teamPro }) => {
    return (
      teamPro &&
      css`
        background: #fff;
        border-top-color: #edffa5;
        color: #090909;
      `
    );
  }}

  ${({ personalPro }) => {
    return (
      personalPro &&
      css`
        background: #fff;
        border-top-color: #ac9cff;
        color: #090909;
      `
    );
  }}

  ${({ orgCustom }) => {
    return (
      orgCustom &&
      css`
        background: #fff;
        border-top-color: #e1e1e1;
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

  background: #161616;
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
    font-size: 28px;
    font-family: 'TWKEverett', sans-serif;
    font-weight: 500;
    line-height: 1;
    margin-bottom: 8px;

    @media (min-width: 769px) {
      font-size: 32px;
      margin-bottom: 1.0875rem;
    }
  }

  .price {
    font-family: 'TWKEverett', sans-serif;
    font-weight: 500;
    line-height: 1;
    font-size: 48px;
    margin-bottom: 8px;

    @media (min-width: 769px) {
      margin-bottom: 12px;
      font-size: 64px;
    }
  }

  .caption {
    font-size: 12px;
    line-height: 16px;
    max-width: 200px;

    @media (min-width: 769px) {
      max-width: 220px;
      font-size: 13px;
    }
  }

  ${({ customPrice }) => {
    return (
      customPrice &&
      css`
        margin-top: -24px; // Visually align with the other cards.

        .plan {
          margin-bottom: 0;

          @media (min-width: 769px) {
            margin-bottom: 0;
          }
        }

        .price {
          @media (min-width: 769px) {
            font-size: 48px;
            line-height: 68px;
          }
        }
      `
    );
  }}
`;

export const ComparePlansLink = styled(({ scrollTo, ...props }) => {
  return (
    <a href="#plans" onClick={scrollTo} {...props}>
      <img src={doubleArrowDown} width="16" alt="" />
      Compare plans
    </a>
  );
})`
  display: flex;
  text-decoration: none;

  color: #edffa5;
  font-weight: 400;
  font-size: 16px;
  line-height: 1;
  letter-spacing: -0.019em;

  img {
    flex-shrink: 0;
    transition: transform 0.2s ease;
    margin-right: 0.4em;
  }

  @media (hover: hover) {
    &:hover img {
      transform: translateY(4px);
    }
  }
`;
