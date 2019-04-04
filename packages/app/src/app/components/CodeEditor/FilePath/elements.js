import styled from 'styled-components';
import ChevronLeft from 'react-icons/lib/md/chevron-left';
import ExitZen from 'react-icons/lib/md/fullscreen-exit';

export const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  height: 2.5rem;
  flex: 0 0 2.5rem;

  display: flex;
  align-items: center;
  font-size: 0.875rem;

  color: rgba(255, 255, 255, 0.8);
  padding: 0 0.5rem;
`;

export const Chevron = styled(ChevronLeft)`
  transition: 0.3s ease all;
  position: absolute;
  font-size: 1rem;

  opacity: 0;
  cursor: pointer;

  ${props => props.hovering === 'true' && 'opacity: 1;'};

  transform: rotateZ(
    ${props => (props.workspacehidden === 'true' ? '180deg' : '0')}
  );
  &:hover {
    transform: rotateZ(
      ${props => (props.workspacehidden === 'true' ? '135deg' : '45deg')}
    );
    color: white;
  }
`;

export const FileName = styled.div`
  transition: 0.3s ease transform;
  transform: ${props => (props.hovering ? 'translateX(20px)' : 'none')};
  flex: 1;
`;

export const StyledExitZen = styled(ExitZen)`
  transition: 0.3s ease opacity;

  cursor: pointer;
  font-size: 1.25rem;

  z-index: 10;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`;
