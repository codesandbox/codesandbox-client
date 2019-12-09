import styled from 'styled-components';
import SyncIcon from 'react-icons/lib/go/sync';

export const Container = styled.div`
  display: flex;
  padding: 1rem;
`;
export const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
  width: 100%;
`;

export const Progress = styled.div`
  display: flex;
  width: 100%;
  height: 2px;
  background-color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
`;

const Bar = styled.div<{ count: number }>`
  flex: ${props => props.count};
  width: 100%;
  height: 100%;
`;

export const SuccessBar = styled(Bar)`
  background-color: ${props => props.theme.green.clearer(0.2)};
`;

export const FailBar = styled(Bar)`
  background-color: ${props => props.theme.red.clearer(0.2)};
`;

export const IdleBar = styled(Bar)`
  background-color: ${props =>
    !props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
  opacity: 0.6;
`;

export const TestData = styled.div`
  flex: 1;
  font-size: 0.875rem;
`;

export const SyncIconStyled = styled(SyncIcon)<{ watching: boolean }>`
  && {
    opacity: ${props => (props.watching ? 1 : undefined)};
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
  font-size: 1.125rem;

  svg {
    transition: 0.3s ease opacity;
    cursor: pointer;
    opacity: 0.8;
    color: ${props => props.theme['button.hoverBackground']};
    margin-left: 0.5rem;

    &:hover {
      opacity: 1;
    }
  }
`;
