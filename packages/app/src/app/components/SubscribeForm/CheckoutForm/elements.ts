import styled, { css } from 'styled-components';
import { CardElement } from 'react-stripe-elements';
import Input from '@codesandbox/common/lib/components/Input';
import { Button } from '@codesandbox/common/lib/components/Button';

export const CardContainer = styled.div`
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Card = styled(CardElement)`
  .base {
    color: white;
    font-weight: 500;
  }
`;

export const NameInput = styled(Input)`
  width: 100%;
  height: 32.8px;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

export const ErrorText = styled.div`
  ${({ theme }) => css`
    margin: 0.25rem 0;
    color: ${theme.red};
    font-size: 0.875rem;
  `}
`;

export const Label = styled.label`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

export const Submit = styled(Button).attrs({
  type: 'submit',
})`
  width: 300;
  margintop: 1rem;
`;
