import InputBase, {
  TextArea as TextAreaBase,
} from '@codesandbox/common/lib/components/Input';
import styled from 'styled-components';

export const Field = styled.fieldset`
  border: none;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.7rem;
`;

export const Input = styled(InputBase)`
  width: 100%;
`;

export const TextArea = styled(TextAreaBase)`
  width: 100%;
`;
