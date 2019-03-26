import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-right: 3rem;
`;

export const VanillaButton = styled.button`
  transition: 0.3s ease color;
  background-color: transparent;
  display: flex;
  border: 0;
  outline: 0;
  padding: 0;
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  vertical-align: middle;
  align-items: center;

  cursor: pointer;

  &:focus {
    color: white;
  }

  &:hover {
    color: white;
  }

  svg {
    margin-left: 0.5rem;
  }
`;
