import styled from 'styled-components';
import { CrossIcon } from './icons/CrossIcon';

export const NotificationContainer = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 41;
`;

export const StyledCrossIcon = styled(CrossIcon)`
  font-size: 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.75);

  &:hover {
    color: white;
  }
`;
