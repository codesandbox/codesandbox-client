import styled from 'styled-components';
import Input from 'app/components/Input';

export const CardContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 4px;
`;

export const NameInput = styled(Input)`
  width: 100%;
  font-size: 0.875rem;
  padding: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  height: 32.8px;
`;

export const ErrorText = styled.div`
  color: ${props => props.theme.red};
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

export const Label = styled.label`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;
