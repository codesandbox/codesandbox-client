import InputBase from '@codesandbox/common/lib/components/Input';
import delay from '@codesandbox/common/lib/utils/animation/delay-effect';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    ${delay()};
    color: ${theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    box-sizing: border-box;
  `};
`;

export const Title = styled.div`
  color: #fd2439fa;
  font-weight: 800;
  display: flex;
  align-items: center;
  vertical-align: middle;

  padding: 0 1rem 0.5rem;

  svg {
    margin-right: 0.25rem;
  }
`;

export const Input = styled(InputBase)`
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
  ${({ theme }) => css`
    padding: 0 1rem 0.25rem;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  `};
`;
