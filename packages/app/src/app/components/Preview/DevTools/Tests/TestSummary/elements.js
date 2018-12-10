// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  padding: 1rem;
`;
export const Title = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  width: 100%;
`;

export const Progress = styled.div`
  display: flex;
  width: 100%;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Bar = styled.div`
  transition: 0.3s ease all;
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
  background-color: rgba(255, 255, 255, 0.5);
`;

export const TestData = styled.div`
  flex: 1;
  font-size: 0.875rem;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  text-align: right;
  font-size: 1.125rem;

  svg {
    transition: 0.3s ease color;
    cursor: pointer;

    margin-left: 0.5rem;

    &:hover {
      color: white;
    }
  }
`;

export const Total = styled.div`
  font-size: 0.875rem;
`;
