import { Button } from '@codesandbox/components';
import styled, { createGlobalStyle, css } from 'styled-components';

export const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: "TWKEverett";
    src: url("/static/fonts/TWKEverett-Medium-web.woff") format("woff"),
      url("/static/fonts/TWKEverett-Medium-web.ttf") format("ttf");
  }
`;

export const PlanTitle = styled.h1`
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.018em;
  transition: all 0.6s ease;
`;

export const UpgradeButton = styled(Button)<{
  planType: 'teamPro' | 'pro' | 'none';
}>`
  height: auto;

  font-size: 16px;
  line-height: 48px;

  display: inline-block;
  width: calc(100% / 2 - 6px);
  color: #151515;

  ${({ planType }) => {
    if (planType === 'pro') {
      return css`
        background: #ac9cff;

        &:hover {
          background: ##7b61ff;
        }
      `;
    }

    if (planType === 'teamPro') {
      return css`
        background: #edffa5;

        &:hover {
          background: #dcff50;
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
  width: calc(100% / 2 - 6px);
  box-sizing: border-box;

  cursor: pointer;
  transition: all 0.2s ease;

  * {
    margin: 0;
  }

  .discount {
    padding: 4px 8px;
    background: rgba(229, 229, 229, 0.1);
    border-radius: 20px;
    transition: background 0.2s ease;
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
  text-align: right;
  color: #808080;
  margin-top: 24px;

  p {
    margin: 0;
  }

  span {
    color: #fff;
  }

  small {
    display: inline-block;
    font-size: 13px;
    line-height: 16px;
  }
`;
