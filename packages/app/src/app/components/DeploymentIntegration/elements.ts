import BaseNotice from '@codesandbox/common/es/components/Notice';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    border-radius: 4px;
    color: ${theme.light ? '#000000' : '#ffffff'};
    font-size: 0.875rem;
    overflow: hidden;
  `}
`;

export const IntegrationBlock = styled.div<{ bgColor: string }>`
  ${({ bgColor }) => css`
    flex: 1;
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    min-height: 45px;
    padding: 0.75em 0.75em;
    background-color: ${bgColor};
    color: white;
    font-size: 1em;
    box-sizing: border-box;
    cursor: pointer;

    > div {
      display: flex;
      align-items: center;
    }
  `}
`;

export const Name = styled.span<{ light: boolean }>`
  ${({ light }) => css`
    margin-left: 0.75em;
    color: ${light ? '#000000' : '#ffffff'};
    font-size: 1.375em;
  `}
`;

export const Notice = styled(BaseNotice)`
  margin-left: 0.7rem;
`;

const iconStyles = ({ light }: { light: boolean }) => css`
  width: 1.5rem;
  height: auto;
  fill: ${light ? '#000' : '#fff'};
  cursor: pointer;
`;

export const Up = styled(FaAngleUp)`
  ${iconStyles}
`;

export const Down = styled(FaAngleDown)`
  ${iconStyles}
`;
