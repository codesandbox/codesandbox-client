import styled, { css, createGlobalStyle } from 'styled-components';

export const CustomLightStyles = createGlobalStyle`
${props =>
  props.light &&
  css`
    html {
      background: ${props.theme.homepage.white} !important;
      body {
        background: ${props.theme.homepage.white};
        color: ${props.theme.homepage.black};
      }
    }

    h1[class*='Title'],
    div[class*='ContentBlock'] h3 {
      color: ${props.theme.homepage.black};
    }

    section[class*='Nav'] ul li:first-child p {
      color: ${props.theme.homepage.black};
    }

    section[class*='elements__Nav'] {
      border-top: 1px solid ${props.theme.homepage.whiteDark};
    }
  `}
`;

export const Wrapper = styled.div`
  padding: 4.5rem 0rem 1rem 0rem;
`;

export const Title = styled.h1`
  ${({ theme }) => css`
    font-family: ${theme.homepage.appleFont};
    font-weight: 900;
    font-size: 2.5rem;
    line-height: 3rem;
    color: ${theme.homepage.white};
    margin: 0.5rem 0;
    text-align: center;
    max-width: 60%;
    margin: auto;

    ${props => props.theme.breakpoints.md} {
      font-size: 1.5rem;
      line-height: 1.2;
      max-width: 80%;
    }
  `};
`;

export const Description = styled.h2`
  ${({ theme }) => css`
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.1875rem;

    color: ${theme.homepage.white};
  `};
`;

export const Banner = styled.div`
  height: 23.75rem;
  width: 100%;
  border-radius: 0.25rem;
  margin-bottom: 5rem;
  margin-top: 3.75rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.12);
`;

export const ContentBlock = styled.div`
  ${({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 3rem 5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${theme.homepage.muted};

    ${props => props.theme.breakpoints.md} {
      grid-template-columns: repeat(1, 1fr);
    }

    h3 {
      font-style: normal;
      font-weight: 500;
      font-size: 1.4375rem;
      line-height: 1.6875rem;
      color: ${theme.homepage.white};
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
  width: 3rem;
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
    border-radius: 1.7rem;
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
      height: 1.5rem;
      padding: 0;
      line-height: 1.5rem;
      font-size: 0.8125rem;
      color: white;
      font-weight: bold;
      box-sizing: border-box;
    }
    &:before {
      content: '';
      padding-left: 0.625rem;
      background-color: ${props => props.theme.homepage.grey};
      color: ${props => props.theme.homepage.white};
    }
    &:after {
      content: '';
      padding-right: 0.625rem;
      background-color: ${props => props.theme.homepage.grey};
      color: ${props => props.theme.homepage.white};
      text-align: right;
    }
  }

  .switch {
    display: block;
    width: 1.25rem;
    margin: 0.125rem;
    background: ${props => props.theme.homepage.white};
    position: absolute;
    top: 0;
    bottom: 0;
    right: 1.5rem;
    border-radius: 1.7rem;
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
  justify-content: center;
  margin: 0;
  flex-wrap: wrap;
  list-style: none;
  margin-bottom: 7.5rem;

  ${props => props.theme.breakpoints.md} {
    justify-content: center;
    margin-bottom: 3.5rem;
  }

  ${props => props.theme.breakpoints.sm} {
    flex-direction: column;
    align-items: center;
  }

  li {
    width: 160px;
    margin-bottom: 1rem;

    &:not(:last-child) {
      margin-right: 3rem;
    }

    ${props => props.theme.breakpoints.sm} {
      &:not(:last-child) {
        margin-right: initial;
      }
    }

    svg {
      margin-right: 1rem;
    }
  }
`;

export const Button = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ light, active, theme: { homepage } }) => {
    if (light) return active ? homepage.grey : homepage.muted;
    return active ? homepage.white : homepage.greyLight;
  }};
`;
