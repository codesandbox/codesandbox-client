import styled, { css } from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';
import CloseIcon from 'react-icons/lib/md/close';
import ReturnIcon from 'react-icons/lib/md/keyboard-return';

export const Container = styled.div`
  ${({ theme }) => css`
    padding: 1.5rem 2rem;
    margin: 0;
    background-color: ${theme.background};
    color: rgba(255, 255, 255, 0.8);
  `}
`;

export const Title = styled.h2`
  ${({ theme }) => css`
    margin-top: 0 !important;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'white'};
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 24px;
  `}
`;

export const Close = styled(CloseIcon)`
  position: absolute;
  right: 20px;
  width: 24px;
  height: 24px;
  color: white;
  cursor: pointer;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
`;

export const UnlockButton = styled(Button).attrs({
  small: true,
  secondary: true,
})`
  width: 90px;
  margin-right: 24px;
`;

export const Enter = styled(ReturnIcon)`
  margin-left: 8px;
  color: white;
`;
