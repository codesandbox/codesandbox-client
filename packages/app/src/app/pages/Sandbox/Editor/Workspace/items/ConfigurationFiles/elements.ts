import styled, { component } from 'app/styled-components';

export const FilesContainer = styled.div`
  margin-top: 1rem;
`;

export const File = styled(component<{
  created: boolean
  onClick: () => void
}>())`
  position: relative;
  transition: 0.3s ease background-color;
  padding: 0.75rem 1rem;

  ${props => props.created && `cursor: pointer`};
  ${props => !props.created && `opacity: 0.9`};
`;

export const CreateButton = styled.button`
  padding: 0.25rem 0.4rem;
  background-color: ${props => props.theme.secondary};
  border: none;
  font-size: 0.75rem;
  color: white;
  border-radius: 2px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.75rem;
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
