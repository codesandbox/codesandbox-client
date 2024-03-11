import styled, { css } from 'styled-components';
import { Stack, Button } from '@codesandbox/components';
import { CrossIcon } from './icons/CrossIcon';

export const NotificationContainer = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 41;
`;

export const StyledCrossIcon = styled(CrossIcon)`
  ${({ theme }) => css`
    position: absolute;
    top: 1rem;
    right: 1rem;
    transition: 0.3s ease color;
    cursor: pointer;
    color: ${theme.colors.grays[400]};

    &:hover {
      color: ${theme.colors.grays[300]};
    }
  `}
`;

export const InnerWrapper = styled(Stack)`
  ${({ theme }) => css`
    width: 100%;
    border: 1px solid ${theme.colors.grays[500]};
    background: ${theme.colors.grays[700]};
    border-top-right-radius: ${theme.radii.medium}px;
    border-bottom-right-radius: ${theme.radii.medium}px;
  `}
`;

export const Container = styled(Stack)`
  ${({ theme }) => css`
    box-sizing: border-box;
    box-shadow: ${theme.shadows[2]};
    border-radius: ${theme.radii.medium}px;
    position: relative;
    font-size: ${theme.fontSizes[3]}px;
    color: ${theme.colors.white};
    width: 450px;
    overflow: hidden;
  `}
`;

export const TertiaryButton = styled(Button)`
  ${({ theme }) => css`
    width: auto;
    background: transparent;
    border: 1px solid ${theme.colors.grays[600]};
  `}
`;
