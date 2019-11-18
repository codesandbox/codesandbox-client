import styled, { css, createGlobalStyle } from 'styled-components';

export const CustomLightStyles = createGlobalStyle`
${props =>
  props.light &&
  css`
    html {
      background: #ffffff !important;
      body {
        background: #ffffff;
        color: #000000;
      }
    }

    h1[class*='Title'],
    div[class*='ContentBlock'] h3 {
      color: #000000;
    }

    section[class*='Nav'] ul li:first-child p {
      color: #000000;
    }

    footer[class*='FooterWrapper'] {
      border-top: 1px solid #e6e6e6;
    }
  `}
`;

export const Title = styled.h1`
  ${({ theme }) => css`
    font-family: ${theme.homepage.appleFont};
    font-weight: 500;
    font-size: 2.5rem;
    line-height: 3rem;
    color: ${theme.homepage.white};
    margin: 0.5rem 0;
    text-align: center;
    max-width: 50%;
    margin: auto;
  `};
`;

export const Description = styled.h2`
  ${({ theme, seoText }) => css`
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 19px;

    color: ${theme.homepage.white};

    ${seoText &&
      css`
        margin-top: 1rem;
        font-size: 2rem;
        line-height: 24px;
        color: ${props => props.theme.homepage.muted};
      `}
  `};
`;

export const Banner = styled.div`
  height: 380px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 7.5rem;
  margin-top: 3.75rem;
  position: relative;
  overflow: hidden;
`;

export const ContentBlock = styled.div`
  ${({ theme, columns }) => css`
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    grid-gap: 3rem 5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${theme.homepage.muted};

    h3 {
      font-style: normal;
      font-weight: 500;
      font-size: 1.4375rem;
      line-height: 27px;
      color: ${theme.homepage.white};
      /* min-height: 54px; */
    }
  `};
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Iframe = styled.iframe`
  border: 0;
  width: 100%;
  height: 100%;
`;

export const Switch = styled.div`
  position: relative;
  width: 48px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  input[type='checkbox'] {
    display: none;

    &:checked + label .inner {
      margin-left: 0;
    }
    &:checked + label .switch {
      right: 0px;
    }
  }
  label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border-radius: 27px;
  }

  .inner {
    display: block;
    width: 200%;
    margin-left: -100%;
    transition: margin 0.2s ease-in 0s;

    &:before,
    &:after {
      display: block;
      float: left;
      width: 50%;
      height: 24px;
      padding: 0;
      line-height: 24px;
      font-size: 13px;
      color: white;
      font-weight: bold;
      box-sizing: border-box;
    }
    &:before {
      content: '';
      padding-left: 10px;
      background-color: #242424;
      color: #ffffff;
    }
    &:after {
      content: '';
      padding-right: 10px;
      background-color: #242424;
      color: #ffff;
      text-align: right;
    }
  }

  .switch {
    display: block;
    width: 20px;
    margin: 2px;
    background: #ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 24px;
    border-radius: 27px;
    transition: all 0.3s ease-in 0s;
  }
`;

export const SwitchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 4rem;
`;

export const Customizations = styled.ul`
  display: flex;
  justify-content: space-between;
  margin: 0;
  flex-wrap: wrap;
  list-style: none;
  margin-bottom: 7.5rem;

  li {
    button {
      background: transparent;
      border: none;
      padding: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;

      color: #757575;
      display: flex;
      align-items: center;
    }

    svg {
      margin-right: 1rem;
    }
  }
`;
