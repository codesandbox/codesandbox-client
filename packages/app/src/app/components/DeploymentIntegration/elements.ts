import styled, { css } from 'styled-components';
import BaseNotice from '@codesandbox/common/lib/components/Notice';
import UpIcon from 'react-icons/lib/fa/angle-up';
import DownIcon from 'react-icons/lib/fa/angle-down';

export const Container = styled.div<{
  light: boolean;
  loading: boolean;
}>`
  ${({ light, loading, theme }) => css`
    display: inline-flex;
    flex-direction: column;
    width: 100%;
    border-radius: 4px;
    color: ${light || theme.light
      ? css`rgba(0, 0, 0)`
      : css`rgba(255, 255, 255)`};
    font-size: 0.875rem;
    overflow: hidden;
    ${loading &&
      css`
        opacity: 0.5;
        pointer-events: none;
      `};
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
    color: ${light ? css`rgba(0, 0, 0)` : css`rgba(255, 255, 255)`};
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

export const Up = styled(UpIcon)`
  ${iconStyles}
`;

export const Down = styled(DownIcon)`
  ${iconStyles}
`;
