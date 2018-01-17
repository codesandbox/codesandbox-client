import styled from 'styled-components';

export default styled.select`
  transition: 0.3s ease border-color;
  background: url(data:image/svg+xml;utf8,'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.95 10"><path fill="white" d="M1.41 4.67l1.07-1.49 1.06 1.49H1.41zM3.54 5.33L2.48 6.82 1.41 5.33h2.13z"/></svg>') no-repeat 95% 50%;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: .2em 1em .2em .2em;
  width: inherit;
  box-sizing: border-box;
  font-weight: 300;
  height: 1.75em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;

  border: 1px solid
    ${props =>
      props.error ? props.theme.red.clearer(0.5) : 'rgba(0, 0, 0, 0.1)'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;
