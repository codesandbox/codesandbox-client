import styled, { createGlobalStyle } from 'styled-components';

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
  transition: all 0.2s ease;
`;

export const UpgradeButton = styled.button`
  border-radius: 3px;
  border: none;
  padding: 8px 20px;

  text-align: center;
  font-weight: 500;

  text-decoration: none;
  color: #151515;
  transition: transform 0.3s ease;
  font-size: 16px;
  line-height: 24px;

  display: inline-block;
  width: calc(100% / 2 - 6px);
  box-sizing: border-box;

  &:disabled {
    opacity: 0.4;
  }

  &:hover {
    background: #edffa5;
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
  }

  .price {
    font-weight: 500;
    font-size: 32px;
    line-height: 42px;
    font-family: 'TWKEverett', sans-serif;
    margin-top: 18px;
    margin-bottom: 4px;
  }

  &.active {
    background: #ffffff;
    border: 1px solid #ffffff;
    color: #090909;

    .discount {
      background: none;
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
  margin-bottom: 24px;
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
