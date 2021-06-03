import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  text-align: left;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;

  > button {
    margin: 1rem;
  }
`;

export const TokenInput = styled.input`
  color: white;

  width: 100%;
  border: none;
  outline: none;
  padding: 1rem;
  font-size: 1.5rem;

  margin: auto;
  border-radius: 2px;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);

  background-color: rgba(0, 0, 0, 0.5);
`;
