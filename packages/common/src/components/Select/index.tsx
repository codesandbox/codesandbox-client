import styled from 'styled-components';

export default styled.select<{ error?: boolean }>`
  transition: 0.3s ease border-color;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNC45NSAxMCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xLjQxIDQuNjdsMS4wNy0xLjQ5IDEuMDYgMS40OUgxLjQxek0zLjU0IDUuMzNMMi40OCA2LjgyIDEuNDEgNS4zM2gyLjEzeiI+PC9wYXRoPjwvc3ZnPg==);
  background-color: rgba(0, 0, 0, 0.3);
  background-position: right;
  background-repeat: no-repeat;
  color: white;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 0.2em 1em 0.2em 0.2em;
  width: inherit;
  box-sizing: border-box;
  font-weight: 400;
  height: 1.75em;
  appearance: none;

  border: 1px solid
    ${props =>
      props.error ? props.theme.red.clearer(0.5) : 'rgba(0, 0, 0, 0.1)'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;
