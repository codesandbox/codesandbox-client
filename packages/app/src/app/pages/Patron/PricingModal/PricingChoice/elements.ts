import styled from 'styled-components';
import Input from '@codesandbox/common/lib/components/Input';
import SignInButton from 'app/pages/common/SignInButton';

export const Container = styled.div`
  padding: 1rem 0;
`;

export const PriceInput = styled(Input)`
  width: 7rem;
  padding-left: 2rem;
  padding-right: 1rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  text-align: center;
`;

export const Month = styled.span`
  position: absolute;
  left: 100%;
  bottom: 1.75rem;
  margin-left: 0.5rem;
  color: rgba(255, 255, 255, 1);
  font-size: 1.125rem;
  font-weight: 300;
`;

export const Currency = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  padding-top: 8px;
  margin: auto;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  font-weight: 300;
`;

export const Notice = styled.p`
  margin: 2rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 400;
  text-align: center;
`;

export const RangeContainer = styled.div`
  width: 300px;
`;

export const StyledSignInButton = styled(SignInButton)`
  display: block;
  width: 300px;
  margin-top: 2rem;
`;
