import styled from 'app/styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 10%;
  text-align: center;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;

  > button {
    margin: 1rem;
  }
`;

export const TokenContainer = styled.input`
  color: white;

  width: 100%;
  max-width: 20em;
  border: none;
  outline: none;
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  margin: auto;

  border-radius: 2px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);

  background-color: rgba(0, 0, 0, 0.5);
`;
