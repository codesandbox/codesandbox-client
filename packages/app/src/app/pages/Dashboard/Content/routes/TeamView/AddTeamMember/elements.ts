import styled from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';

export const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const AddUserForm = styled.form`
  display: flex;
`;

export const AddButton = styled(Button).attrs({
  small: true,
})`
  width: 200;
`;
