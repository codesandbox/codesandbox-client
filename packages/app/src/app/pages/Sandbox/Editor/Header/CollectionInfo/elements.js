import styled from 'styled-components';

export const SandboxName = styled.span`
  color: white;
  margin-left: 0.25rem;
`;

export const FolderName = styled.button`
  display: inline-block;
  cursor: pointer;
  transition: 0.3s ease color;
  padding: 0;
  margin: 0;
  outline: 0;
  border: 0;
  background-color: transparent;
  color: inherit;

  margin-right: 0.25rem;
  &:hover {
    color: white;
  }
`;
