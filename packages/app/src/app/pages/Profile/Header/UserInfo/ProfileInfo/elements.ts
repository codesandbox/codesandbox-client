import RowBase from '@codesandbox/common/es/components/flex/Row';
import delayEffect from '@codesandbox/common/es/utils/animation/delay-effect';
import { GoMarkGithub } from 'react-icons/go';
import styled, { css } from 'styled-components';

export const ProfileImage = styled.img`
  ${({ theme }) => css`
    border-radius: 2px;
    margin-right: 1.5rem;

    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.5);
    background-color: ${theme.background2};

    ${delayEffect(0.05)};
  `};
`;

export const Name = styled.div`
  ${delayEffect(0.1)};
  display: flex;
  align-items: center;
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 0.25rem;
`;

export const Row = styled(RowBase)`
  flex: 1;
`;

export const Username = styled.div<{ main: boolean }>`
  ${({ main }) => css`
    ${delayEffect(0.15)};
    display: flex;
    align-items: center;
    font-size: ${main ? 1.5 : 1.25}rem;
    font-weight: 200;
    color: ${main ? 'white' : 'rgba(255, 255, 255, 0.6)'};
    margin-bottom: 1rem;
  `};
`;

export const GitHubIcon = styled(GoMarkGithub)`
  margin-left: 0.75rem;
  font-size: 1.1rem;
  color: white;
`;
