import styled from 'styled-components';

export default styled.select`
  transition: 0.3s ease border-color;
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  outline: none;
  border-radius: 4px;
  color: white;
  width: inherit;
  box-sizing: border-box;
  font-weight: 300;
  height: 1.75em;

  border: 1px solid
    ${props =>
      props.error ? props.theme.red.clearer(0.5) : 'rgba(0, 0, 0, 0.1)'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;
