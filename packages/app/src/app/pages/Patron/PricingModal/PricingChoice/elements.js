import styled from 'styled-components';
import Input from 'common/lib/components/Input';
import SignInButton from 'app/pages/common/SignInButton';

export const Container = styled.div`
  padding: 1rem 0;
`;

export const PriceInput = styled(Input)`
  font-size: 1.5rem;
  padding-left: 2rem;
  padding-right: 1rem;
  width: 7rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Month = styled.span`
  position: absolute;
  margin-left: 0.5rem;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 1);
  left: 100%;
  font-weight: 300;
  bottom: 1.75rem;
`;

export const Currency = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 1.5rem;
  font-weight: 300;
  padding-top: 8px;
  color: rgba(255, 255, 255, 0.5);
`;

export const Notice = styled.p`
  font-size: 0.875rem;
  text-align: center;
  margin: 2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
`;

export const RangeContainer = styled.div`
  width: 300px;
`;

export const StyledSignInButton = styled(SignInButton)`
  display: block;
  margin-top: 2rem;
  width: 300px;
`;
