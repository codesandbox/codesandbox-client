import { Button } from '@codesandbox/components';
import styled, { css } from 'styled-components';

export const PlanTitle = styled.h1`
  font-family: 'Everett', sans-serif;
  font-weight: 500;
  letter-spacing: -0.018em;
  transition: all 0.6s ease;

  font-size: 24px;
  margin-top: 32px;
  color: #e5e5e5;
  margin-top: 40px;

  @media (min-width: 720px) {
    font-size: 40px;
    line-height: 56px;
  }
`;

export const UpgradeButton = styled(Button)<{
  planType: 'teamPro' | 'pro' | 'none';
}>`
  height: auto;

  font-size: 16px;
  line-height: 48px;

  display: inline-block;
  color: #151515;
  margin-bottom: 8px;

  @media (min-width: 720px) {
    width: calc(100% / 2 - 6px);
    margin-bottom: 0;
  }

  ${({ planType }) => {
    if (planType === 'pro') {
      return css`
        background: #ac9cff;

        &:focus,
        &:hover {
          background: #7b61ff !important;
        }
      `;
    }

    if (planType === 'teamPro') {
      return css`
        background: #edffa5;

        &:focus,
        &:hover {
          background: #dcff50 !important;
        }
      `;
    }

    return css``;
  }}

  &:disabled {
    opacity: 0.4;
  }

  &:focus {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1);
  }
`;

export const SwitchPlan = styled.button`
  background: #191919;
  border: 1px solid #2a2a2a;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;

  color: #c5c5c5;
  text-align: left;
  font-size: 13px;
  line-height: 16px;

  padding: 24px;
  box-sizing: border-box;

  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 8px;

  @media (min-width: 720px) {
    width: calc(100% / 2 - 6px);
    margin-bottom: 0;
  }

  * {
    margin: 0;
  }

  .discount {
    padding: 4px 8px;
    background: rgba(229, 229, 229, 0.1);
    border-radius: 20px;
    transition: background 0.2s ease;
  }

  .period {
    height: 24px;
    line-height: 24px;
  }

  .caption {
    height: 32px;
    width: 140px;
  }

  .price {
    font-weight: 500;
    font-size: 32px;
    line-height: 42px;
    margin-top: 18px;
    margin-bottom: 4px;
    font-family: 'TWKEverett', sans-serif;

    span {
      color: #434343;
      transition: color 0.2s ease;
      text-decoration: line-through;
    }
  }

  &.active {
    background: #ffffff;
    border: 1px solid #ffffff;
    color: #090909;

    .discount {
      background: #dbdbde;
    }

    .price span {
      color: #c5c5c5;
    }
  }
`;

export const Caption = styled.p`
  font-size: 13px;
  line-height: 16px;
  color: #e5e5e5;
  margin: 0 0 12px;
`;

export const BoxPlaceholder = styled.div`
  background: #191919;
  border: 1px solid #2a2a2a;
  height: 80px;
  display: flex;

  span {
    margin: auto;
    font-size: 24px;
    line-height: 32px;
    color: #808080;
  }
`;

export const Summary = styled.div`
  text-align: center;
  color: #808080;
  margin-top: 24px;

  @media (min-width: 720px) {
    text-align: right;
  }

  p {
    margin: 0 0 4px 0;
  }

  span {
    color: #fff;
    display: block;

    @media (min-width: 720px) {
      display: inline;
    }
  }

  small {
    display: inline-block;
    font-size: 13px;
    line-height: 16px;
  }
`;
