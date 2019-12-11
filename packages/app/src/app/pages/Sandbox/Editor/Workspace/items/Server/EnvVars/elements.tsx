import styled from 'styled-components';
import EnvIcon from 'react-icons/lib/go/key';

export const EnvironmentIcon = styled(EnvIcon)`
  margin-right: 0.6rem;
  font-size: 1rem;
  margin-left: 4px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  font-size: 12px;
  margin: 0.5rem 0;
  font-style: italic;
`;
