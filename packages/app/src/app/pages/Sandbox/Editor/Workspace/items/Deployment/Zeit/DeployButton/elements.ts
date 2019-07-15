import styled from 'styled-components';

export const Overlay = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 1);
  max-width: 80%;
`;

export const CreateFile = styled.button`
  padding: 0;
  margin: 0;
  background: transparent;
  color: ${props => props.theme.link};
  border: none;
`;
