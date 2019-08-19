import styled from 'styled-components';

export const InputContainer = styled.div`
  display: inline-block;
  overflow: auto;
  input {
    transition: 0.3s ease all;
    font-family: inherit;
    position: absolute;
    border: 1px solid ${props => props.theme.primary};
    outline: none;
    background-color: ${props =>
      props.errorMessage
        ? props.theme.redBackground.clearer(0.5)
        : 'rgba(0, 0, 0, 0.2)'};
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
