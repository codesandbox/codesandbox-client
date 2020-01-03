import styled from 'styled-components';
import AutosizeInput from 'react-input-autosize';
import { styles } from '../Input';

export default styled(AutosizeInput)`
  input {
    ${styles};
  }
`;
