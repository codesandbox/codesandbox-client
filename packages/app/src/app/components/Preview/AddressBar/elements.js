import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  color: ${props => props.theme.gray.darken(0.2)()};
  vertical-align: middle;
  font-size: 1rem;
`;

export const InputContainer = styled.div`
  input {
    border-radius: 4px;
    outline: none;
    border: 1px solid #ccc;
    padding: 0.2rem 0.5rem;
    color: black;
    width: 100%;
    color: rgba(0, 0, 0, 0.8);
    box-sizing: border-box;
  }
`;
