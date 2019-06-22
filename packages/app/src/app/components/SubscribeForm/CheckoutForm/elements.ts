import styled from 'styled-components';
import Input from '@codesandbox/common/lib/components/Input';

export const CardContainer = styled.div`
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const StripeInput = styled(Input)`
  width: 100%;
  height: 32.8px;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

export const ErrorText = styled.div`
  margin: 0.25rem 0;
  color: ${props => props.theme.red};
  font-size: 0.875rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
`;
