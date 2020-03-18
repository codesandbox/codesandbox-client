import styled from 'styled-components';
import { Input } from '@codesandbox/components';

export const CardContainer = styled.div`
  margin-top: 0.25rem;
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
