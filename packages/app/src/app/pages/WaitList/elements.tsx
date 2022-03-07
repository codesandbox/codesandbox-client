import React from 'react';
import styled from 'styled-components';

import './fonts/index.css';

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0f0e0e;
  display: flex;
  flex-direction: column;
`;

export const Center = styled.div`
  margin: auto;
  text-align: center;
  max-width: 568px;
  width: 100%;
`;

export const SubTitle = styled.h2`
  color: #fff;
  font-size: 18px;
  letter-spacing: -0.05em;
  line-height: 1;
  font-family: Everett, sans-serif;
  margin: 0 0 20px 0;
`;

export const MainTitle = styled.h1`
  color: #fff;
  font-size: 48px;
  letter-spacing: -0.05em;
  line-height: 1.2;
  font-weight: 500;
  font-family: Everett, sans-serif;
  margin: 0 0 20px 0;
`;

export const Paragraph = styled.p`
  font-size: 18px;
  line-height: 25.2px;
  letter-spacing: -0.0125em;
  color: #999;
  max-width: 368px;
  margin: 0 auto 40px;
`;

export const Avatar = styled.img`
  width: 50px;
  width: 50px;
  border-radius: 100%;
  margin-bottom: 40px;
`;

export const Button = styled.button`
  border: 0;
  outline: 0;
  padding: 10px 16px;

  background: #dcff50;
  border-radius: 2px;

  color: #0f0e0e;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  line-height: 1;

  display: inline-flex;
  align-items: center;

  svg {
    display: block;

    margin-right: 8px;
  }
`;

const FootNote = styled.p`
  font-size: 10px;
  line-height: 14px;
  text-align: center;
  color: #808080;
  margin: 0 auto 40px;
  max-width: 222px;

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

export const TermsAndUsage = () => {
  return (
    <FootNote>
      By clicking Sign in, you agree to CodeSandbox{' '}
      <a
        href="https://codesandbox.io/legal/terms"
        target="_blank"
        rel="noreferrer"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="https://codesandbox.io/legal/privacy"
        target="_blank"
        rel="noreferrer"
      >
        Privacy Policy
      </a>
    </FootNote>
  );
};

export const Loading = () => {
  return (
    <Wrapper>
      <Center>
        <Paragraph>Loading...</Paragraph>
      </Center>
    </Wrapper>
  );
};

export const ExternalLink = styled.a`
  color: #dcff50;
  text-decoration: none;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
`;
