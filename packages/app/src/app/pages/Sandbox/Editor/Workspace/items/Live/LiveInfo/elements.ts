import Input from '@codesandbox/common/lib/components/Input';
import delay from '@codesandbox/common/lib/utils/animation/delay-effect';
import styled, { css } from 'styled-components';

import { Theme } from './types';

export const Container = styled.div`
  ${({ theme }: Theme) => css`
    ${delay()};
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    box-sizing: border-box;
  `}
`;

export const Title = styled.div`
  color: #fd2439fa;
  font-weight: 800;
  display: flex;
  align-items: center;
  vertical-align: middle;
  padding: 0.5rem 1rem;
  padding-top: 0;

  svg {
    margin-right: 0.25rem;
  }
`;

export const ConnectionStatus = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-size: 1rem;
`;

export const StyledInput = styled(Input)`
  width: calc(100% - 1.5rem);
  margin: 0 0.75rem;
  font-size: 0.875rem;
`;

export const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  padding-left: 1rem;
  font-size: 0.875rem;
`;

export const Users = styled.div`
  ${({ theme }: Theme) => css`
    padding: 0.25rem 1rem;
    padding-top: 0;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
  `}
`;

export const IconContainer = styled.div`
  ${({ theme }: Theme) => css`
    transition: 0.3s ease color;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.8)`
      : css`rgba(255, 255, 255, 0.8)`};
    cursor: pointer;

    &:hover {
      color: white;
    }
  `}
`;

export const NoUsers = styled.div`
  margin-top: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
`;
