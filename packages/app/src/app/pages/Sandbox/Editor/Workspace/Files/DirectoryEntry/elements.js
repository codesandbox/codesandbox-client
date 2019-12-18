import styled from 'styled-components';

export const EntryContainer = styled.div`
  position: relative;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${props => (props.isOver ? 'block' : 'none')};
`;

export const Opener = styled.div`
  height: ${props => (props.open ? '100%' : '0px')};
  overflow: hidden;
`;
