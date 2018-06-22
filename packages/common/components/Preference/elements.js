import styled from 'styled-components';
import Input from 'common/components/Input';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledInput = Input.extend`
  text-align: center;
`;
