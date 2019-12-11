import { Button as ButtonBase } from '@codesandbox/common/lib/components/Button';
import Input from '@codesandbox/common/lib/components/Input';
import styled from 'styled-components';

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

export const Button = styled(ButtonBase)`
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

export const StripeInputContainer = styled.div`
  margin: 2rem 5rem 0;
`;

export const Centered = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const CancelText = styled.button`
  transition: 0.3s ease color;
  background-color: transparent;
  outline: 0;
  border: 0;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.875rem;
  margin-top: 1rem;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;
