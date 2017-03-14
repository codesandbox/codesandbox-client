import styled from 'styled-components';

export default styled.div`
  display: inline-block;
  display: flex;
  overflow: visible;
  font-size: .875rem;
  margin: 0.5rem 0.75rem;
  input {
    transition: 0.3s ease all;
    font-family: inherit;
    margin: 0 0.25rem;
    padding: 0.25rem;
    width: 100%;
    outline: none;
    border: none;
    background-color: ${props => (props.errorMessage ? props.theme.redBackground.clearer(0.5) : 'rgba(0, 0, 0, 0.2)')};
    color: ${props => (props.errorMessage ? props.theme.red : props.theme.white)};

    &:focus {
      border: none;
      outline: none;
    }
  }

  input::-webkit-input-placeholder {
    color: ${props => props.theme.background2.lighten(2.9)};
  }
`;
