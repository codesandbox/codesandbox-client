import styled, { css } from "styled-components";
import React from "react";
import Button from "./Button";

export const Wrapper = styled.div`
  padding: 0rem;
`;

export const Title = styled.h1`
  ${({ theme }) => css`
    font-family: ${theme.homepage.appleFont};
    font-family: "TWKEverett", sans-serif;
    font-weight: normal;
    font-size: 64px;
    line-height: 120%;
    letter-spacing: -0.025em;
    color: ${theme.homepage.white};
    margin: 10rem auto 1rem auto;
    text-align: center;
    max-width: 100%;

    ${(props) =>
      props.left &&
      `
    text-align: left;
  
  `}

    ${(props) => props.theme.breakpoints.md} {
      font-size: 1.5rem;
      line-height: 1.2;
    }
  `};
`;

export const Subtitle = styled.h2`
  font-family: "TWKEverett", sans-serif;
  font-weight: normal;
  font-size: 48px;
  line-height: 120%;
  letter-spacing: -0.025em;
  margin: 12rem auto 4rem auto;
  text-align: center;
  max-width: 100%;

  h6 {
    margin: 1rem 0;
  }
`;

export const ContentBlock = styled.div`
  ${({ theme, cols, center }) => css`
    display: grid;
    grid-template-columns: repeat(${cols || "3"}, 1fr);
    grid-gap: 3rem 5rem;
    font-size: 16px;
    line-height: 140%;
    color: ${theme.homepage.muted};
    margin-top: 2rem;

    ${(props) => props.theme.breakpoints.lg} {
      font-size: 16px;
      grid-template-columns: repeat(1, 1fr);
    }

    ${(props) => props.theme.breakpoints.sm} {
      font-size: 16px;
      margin-bottom: 0rem;
    }

    ${center && `text-align: center;`}

    h3 {
      font-style: normal;
      font-weight: 900;
      font-size: 19px;
      line-height: 23px;
      color: ${theme.homepage.white};
      margin-bottom: 1rem;

      ${(props) => props.theme.breakpoints.sm} {
        font-size: 19px;
      }
    }
  `};
`;

export const ContentBlockImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  margin-bottom: 3.5rem;
  box-sizing: border-box;
  border-radius: 8px;

  ${(props) => {
    if (props.bg) {
      return `  background: #${props.bg};`;
    }

    if (!props.noBorder) {
      return `  border: 1px solid #343434;`;
    }

    return null;
  }}
`;

export const FeaturedImage = styled.div`
  overflow: hidden;

  width: 100%;
  height: 440px;
  background: url(${(props) => props.bg});
  margin-bottom: 3.5rem;

  display: flex;
  align-items: flex-end;
  justify-content: center;
  border: 1px solid #242424;
  background-size: cover;
  border-radius: 4px;

  ${(props) => props.theme.breakpoints.md} {
    height: auto;
  }
  @media screen and (prefers-reduced-motion: no-preference) {
    img {
      top: 4rem;
      position: relative;
    }
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Quote = styled.section`
  min-height: 80vh;
  padding-top: 10rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h3 {
    margin: 30px auto;
    font-weight: 900;
    font-size: 48px;
    line-height: 57px;
    color: #ffffff;

    ${(props) => props.theme.breakpoints.sm} {
      font-size: 32px;
    }
  }

  h4 {
    font-weight: normal;
    font-size: 23px;
    line-height: 27px;
    color: #ffffff;
    ${(props) => props.theme.breakpoints.sm} {
      font-size: 16px;
    }
  }
`;

export const CTABottom = () => (
  <div
    css={`
      margin: auto;
      display: flex;
      justify-content: center;
      margin: 96px auto;
    `}
  >
    <Button href="https://codesandbox.io/s/">
      Get Started
    </Button>
  </div>
);
