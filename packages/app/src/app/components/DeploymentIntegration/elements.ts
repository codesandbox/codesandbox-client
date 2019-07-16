import BaseNotice from '@codesandbox/common/lib/components/Notice';
import BaseDown from 'react-icons/lib/fa/angle-down';
import BaseUp from 'react-icons/lib/fa/angle-up';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: inline-flex;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    flex-direction: column;
    font-size: 0.875rem;

    color: ${theme.light ? '#000000' : '#ffffff'};
  `}
`;

export const Down = styled(BaseDown)<{ light: boolean }>`
  ${({ light }) => css`
    fill: ${light ? '#000000' : '#ffffff'};
    cursor: pointer;
    width: 1.5rem;
    height: auto;
  `}
`;

export const IntegrationBlock = styled.div<{ bgColor: string }>`
  ${({ bgColor }) => css`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
    background-color: ${bgColor};
    flex: 1;
    color: white;
    padding: 0.75em 0.75em;
    min-height: 45px;
    font-size: 1em;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;
    }
  `}
`;

export const Name = styled.span<{ light: boolean }>`
  ${({ light }) => css`
    margin-left: 0.75em;
    font-size: 1.375em;
    color: ${light ? '#000000' : '#ffffff'};
  `}
`;

export const Notice = styled(BaseNotice)`
  margin-left: 0.7rem;
`;

export const Up = styled(BaseUp)<{ light: boolean }>`
  ${({ light }) => css`
    fill: ${light ? '#000000' : '#ffffff'};
    cursor: pointer;
    width: 1.5rem;
    height: auto;
  `}
`;
