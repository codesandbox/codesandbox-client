import React from 'react';
import styled from 'styled-components';

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
