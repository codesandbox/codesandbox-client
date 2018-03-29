import styled, { component } from 'app/styled-components';

export const InputContainer = styled(component<{
  errorMessage?: string
}>())`
  display: inline-block;
  overflow: auto;
  input {
    transition: 0.3s ease all;
    font-family: inherit;
    position: absolute;
    top: 0.1rem;
    bottom: 0.1rem;
    border: 1px solid ${props => props.theme.primary};
    outline: none;
    background-color: ${props =>
      props.errorMessage
        ? props.theme.redBackground.clearer(0.5)
        : 'rgba(0, 0, 0, 0.2)'};
    margin: 0.2rem;
    padding-left: 0.25rem;
    margin-left: 0.25rem;
    color: ${props =>
      props.errorMessage ? props.theme.red : props.theme.white};

    &:focus {
      border: none;
      outline: none;
    }
  }
`;
