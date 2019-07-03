import styled from 'styled-components';
import Input from '@codesandbox/common/lib/components/Input';
import Centered from '@codesandbox/common/lib/components/flex/Centered';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin: 1rem;
`;

export const Content = styled(Centered)`
  max-width: 50em;
  margin: auto;
`;

export const Wrapper = styled.div`
  margin-top: 10%;
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

export const StyledInput = styled(Input)`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  margin-bottom: 2rem;
`;
