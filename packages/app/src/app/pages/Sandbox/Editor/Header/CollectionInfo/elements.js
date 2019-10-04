import styled from 'styled-components';
import AutosizeInput from 'react-input-autosize';

export const Container = styled.div`
  display: flex;
  position: relative;
  font-size: 0.875rem;
  align-items: center;
  white-space: nowrap;
  text-align: center;
`;

export const SandboxName = styled.span`
  color: ${props => (props.theme.light ? 'black' : 'white')};
  margin-left: 0.25rem;

  cursor: pointer;
  text-overflow: ellipsis;
`;

export const SandboxForm = styled.form`
  position: 'absolute';
  left: 0;
  right: 0;
  display: 'flex';
  align-items: 'center';
  justify-content: 'center';
`;

export const SandboxInput = styled(AutosizeInput)`
  input {
    display: inline-block;
    background-color: transparent;
    outline: 0;
    border: 0;
    color: white;
    margin: 0;
    padding: 0;
    text-align: center;
  }
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
