import styled, { css } from 'styled-components';
import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';

export const HeaderRow = styled.tr`
  height: 3rem;
`;

export const HeaderTitle = styled.th`
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  text-align: left;
`;

export const Table = styled.table`
  ${({ theme }) => css`
    width: 100%;
    margin-bottom: 2rem;
    border-spacing: 0;
    background: ${theme.background2};
    ${delayEffect(0.2)};
  `}
`;

export const StatTitle = styled(HeaderTitle)`
  width: 2rem;
  text-align: center;
`;

export const StatBody = styled.td`
  width: 2rem;
  text-align: center;
`;

export const DeleteBody = styled(StatBody)`
  padding: 0.55rem 0.5rem;
  cursor: pointer;
`;

export const Body = styled.tbody`
  ${({ theme }) => css`
    margin-top: 3rem;
    background: ${theme.background2};
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};

    td {
      padding: 1rem 0.5rem;
      margin: 0;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
  `}
`;

export const SandboxRow = styled.tr<{ delay: number }>`
  ${({ delay, theme }) => css`
    margin: 0;
    border: none;
    transition: 0.3s ease all;
    ${delayEffect(0.25 + delay * 0.05, false)};

    &:hover {
      background-color: ${theme.primary.clearer(0.9)};
      color: rgba(255, 255, 255, 0.9);
    }
  `}
`;
