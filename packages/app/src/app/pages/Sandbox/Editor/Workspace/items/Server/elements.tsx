import styled from 'styled-components';
import { Button } from '@codesandbox/common/lib/components/Button';
import PowerIcon from 'react-icons/lib/md/power-settings-new';
import { WorkspaceInputContainer } from '../../elements';

export const SubTitle = styled.div`
  text-transform: uppercase;
  font-weight: 700;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};

  padding-left: 1rem;
  font-size: 0.875rem;
`;

export const TasksContainer = styled(WorkspaceInputContainer)<{
  disconnected: boolean;
}>`
  display: flex;
  flex-direction: column;
  pointer-events: ${props => (props.disconnected ? 'none' : 'initial')};
  opacity: ${props => (props.disconnected ? 0.5 : 1)};
`;

export const Port = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;

  > div {
    margin-left: 0.75rem;
  }
`;

export const MainBadge = styled.div`
  font-weight: 600;
  position: absolute;
  right: 2rem;
`;

export const ActionButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Power = styled(PowerIcon)`
  font-size: 1.125em;
  margin-right: 0.25rem;
`;
