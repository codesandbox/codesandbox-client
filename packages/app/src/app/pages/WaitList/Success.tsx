import React from 'react';
import { MainTitle, Paragraph, ExternalLink } from './elements';

export const SuccessStep = () => {
  return (
    <>
      <svg
        width="50"
        height="37"
        viewBox="0 0 50 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginBottom: 40 }}
      >
        <path d="M2.5 16L18.5 32L47.5 3" stroke="white" strokeWidth="7" />
      </svg>

      <MainTitle>
        Yuppp! <br /> You are on the waitlist
      </MainTitle>
      <Paragraph>
        Stay tuned and see all the news from CodeSandbox on Twitter.
      </Paragraph>
      <ExternalLink
        target="_blank"
        rel="noreferrer"
        href="https://twitter.com/codesandbox"
      >
        Ok, thanks!
      </ExternalLink>
    </>
  );
};
