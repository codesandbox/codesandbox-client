import Centered from '@codesandbox/common/lib/components/flex/Centered';
import InputBase from '@codesandbox/common/lib/components/Input';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

export const Content = styled(Centered)`
  max-width: 50em;
  margin: 5rem auto auto;
`;

export const Label = styled.label`
  text-align: left;
  width: 100%;
  margin-bottom: 0.25rem;
  color: rgba(255, 255, 255, 0.3);
`;

export const Description = styled.div`
  margin-bottom: 1rem;
`;

export const Input = styled(InputBase)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

export const ErrorMessage = styled.div`
  ${({ theme }) => css`
    color: ${theme.red};
    margin-bottom: 2rem;
  `};
`;
