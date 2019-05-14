import styled from 'styled-components';

export const ProgressBar = styled.div`
  padding: 0 calc(1rem - 3px);
  box-sizing: border-box;
  display: flex;
  height: 3px;
  width: 100%;
  border-radius: 1px;
`;

const BaseBar = styled.div<{ count: number }>`
  border-radius: 1px;
  height: 3px;
  flex: ${props => props.count};
  margin: 0 ${props => (props.count !== 0 ? 3 : 0)}px;
`;

export const SuccessBar = styled(BaseBar)`
  background-color: ${props => props.theme.green};
`;

export const FailedBar = styled(BaseBar)`
  background-color: ${props => props.theme.red};
`;

export const IdleBar = styled(BaseBar)`
  background-color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
`;
