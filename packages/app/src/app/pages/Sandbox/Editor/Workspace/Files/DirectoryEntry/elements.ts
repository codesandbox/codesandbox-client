import styled, { component } from 'app/styled-components';

export const EntryContainer = styled.div`
  position: relative;
`;

export const Overlay = styled(component<{
  isOver: boolean
}>())`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => (props.isOver ? 'block' : 'none')};
`;

export const Opener = styled(component<{
  open: boolean
}>())`
  height: ${props => (props.open ? '100%' : '0px')};
  overflow: hidden;
`;
