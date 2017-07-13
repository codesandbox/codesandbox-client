import styled from 'styled-components';

export default styled.input`
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  outline: none;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, .1);
  color: white;
  padding: 0.25em;
  width: inherit;
  box-sizing: border-box;

  border: 1px solid
    ${props =>
      props.error ? props.theme.red.clearer(0.5) : 'rgba(0,0,0 0.1)'};
`;
