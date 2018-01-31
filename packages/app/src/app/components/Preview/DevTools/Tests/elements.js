// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  background-color: ${props => props.theme.background4};
  color: rgba(255, 255, 255, 0.8);
`;

export const Navigation = styled.div`
  flex: 2;
  border-right: 1px solid rgba(0, 0, 0, 0.3);

  box-sizing: border-box;
  overflow-y: auto;
`;

export const TestContainer = Navigation.extend`
  background-color: ${props => props.theme.background2};
`;

export const TestDetails = styled.div`
  flex: 3;
  background-color: ${props => props.theme.background};

  padding: 1rem;
`;
