import React, { useState } from 'react';
import styled from 'styled-components';
import { Center, MainTitle, Wrapper, TermsAndUsage } from './elements';

const data = [
  {
    type: 'environment',
    question: 'Where do you host your code?',
    options: ['GitHub', 'GitLab', 'Bitbucket'],
  },
  {
    type: 'environment',
    question: 'Where do you run your code when developing?',
    options: [
      'Docker containers using docker-compose',
      'In Docker containers using Kubernetes',
      'Directly on my local machine',
      'In a self-hosted cloud',
    ],
  },
  {
    type: 'team_size',
    question: 'How many people are part of your team?',
    options: ['1 - 10', '11 - 30', '31 - 50', '50 or more'],
  },
];

const hints = 'ABCDEF';

export const Survey = () => {
  const [step, setStep] = useState(0);

  return (
    <Wrapper>
      <Center>
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: 40 }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 50H50V0H0V50ZM44.8864 44.8864V5.11364H5.11364V44.8864H44.8864Z"
            fill="white"
          />
        </svg>
        <MainTitle>{data[step].question}</MainTitle>

        {data[step].options.map((item, index) => {
          return (
            <Option type="button">
              {item} <span>{hints[index]}</span>
            </Option>
          );
        })}

        <NavWrapper>
          <NavLink
            disabled={step === 0}
            onClick={() => setStep(prev => prev - 1)}
            type="button"
          >
            Back
          </NavLink>

          <NavLink
            disabled={data.length - 1 === step}
            onClick={() => setStep(prev => prev + 1)}
            type="button"
          >
            Skip
          </NavLink>
        </NavWrapper>
      </Center>

      <TermsAndUsage />
    </Wrapper>
  );
};

const Option = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;

  max-width: 360px;
  width: 100%;
  height: 40px;
  background: #151515;
  padding: 0 8px 0 12px;
  border-radius: 2px;

  border: 0;
  box-sizing: border-box;

  text-align: left;
  font-size: 14px;
  letter-spacing: -0.025em;
  color: #999999;
  margin: 0 auto 2px;

  span {
    display: flex;
    justify-content: center;
    align-items: center;

    background: #2a2a2a;
    border-radius: 4px;
    width: 24px;
    height: 24px;

    font-size: 12px;
    line-height: 15px;
    text-align: center;
    letter-spacing: -0.025em;
    color: #999999;
  }
`;

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 360px;
  width: 100%;
  margin: 40px auto 0;
`;

const NavLink = styled.button`
  text-decoration: underline;
  color: #808080;
  background: none;
  border: 0;
  font-size: 10px;
  padding: 0;
`;
