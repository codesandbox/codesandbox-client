import styled from 'styled-components';

export const Task = styled.button`
  transition: 0.3s ease color;

  border: none;
  outline: none;
  background-color: transparent;

  display: flex;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  margin-left: 0.25rem;

  align-items: center;
  font-weight: 500;

  svg {
    margin-right: 0.75rem;
    font-size: 1.125em;
    margin-top: 4px;
  }

  &:hover {
    color: white;
  }
`;
