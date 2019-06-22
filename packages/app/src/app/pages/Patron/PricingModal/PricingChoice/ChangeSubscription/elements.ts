import styled from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';
import Input from '@codesandbox/common/lib/components/Input';

export const SmallText = styled.div`
  text-align: center;
  font-size: 0.875rem;

  margin: 1rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1rem;
`;

export const StyledButton = styled(Button)`
  margin: 1rem;
`;

export const StripeInput = styled(Input)`
  width: 100%;
  font-size: 0.875rem;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  height: 32.8px;
`;
