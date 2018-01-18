import styled from 'styled-components';

export const FilesContainer = styled.div`
  margin-top: 1rem;
`;

export const File = styled.div`
  transition: 0.3s ease background-color;
  padding: 1rem;

  border-top: 1px solid rgba(0, 0, 0, 0.3);

  cursor: pointer;

  &:last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const FileTitle = styled.div`
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
  vertical-align: middle;
`;

export const FileDescription = styled.p`
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0;
`;
