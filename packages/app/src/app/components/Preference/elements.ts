import styled from 'styled-components';

import { Input as InputBase } from '@codesandbox/components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Input = styled(InputBase)`
  text-align: center;
`;
