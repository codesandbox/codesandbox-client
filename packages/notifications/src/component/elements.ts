import styled from 'styled-components';
import { CrossIcon } from './icons/CrossIcon';

export const NotificationContainer = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 41;
`;

export const StyledCrossIcon = styled(CrossIcon)`
  transition: 0.3s ease color;
  cursor: pointer;

  &:hover {
    path {
      opacity: 0.4;
    }
  }
`;
