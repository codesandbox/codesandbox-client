// @flow
import styled, { css } from 'styled-components';

import Check from 'react-icons/lib/go/check';
import Cross from 'react-icons/lib/go/x';
import DotIcon from 'react-icons/lib/go/primitive-dot';
import LoadingBubbles from './LoadingBubbles';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  background-color: ${props => props.theme.background4};
  color: rgba(255, 255, 255, 0.8);
`;

export const Navigation = styled.div`
  flex: 2;

  box-sizing: border-box;
  overflow-y: auto;
  min-width: 450px;
`;

export const TestContainer = styled(Navigation)`
  background-color: ${props => props.theme.background2};
  height: 100%;
`;

export const TestDetails = styled.div`
  flex: 3;
  background-color: ${props => props.theme.background};
  height: 100%;
`;

const iconStyles = css`
  margin-right: 0.25rem;
  font-size: 1.125em;
  flex: 0 0 1.125em;
`;

export const Loading = styled(LoadingBubbles)`
  ${iconStyles};
  color: ${props => props.theme.secondary};
`;

export const Success = styled(Check)`
  ${iconStyles};
  color: ${props => props.theme.green};
`;

export const Fail = styled(Cross)`
  ${iconStyles};
  color: ${props => props.theme.red};
`;

export const Dot = styled(DotIcon)`
  ${iconStyles};
  color: rgba(255, 255, 255, 0.3);
`;

export const StatusElements = {
  pass: Success,
  fail: Fail,
  running: Loading,
  idle: Dot,
};

export const TestElementContainer = styled.div`
  margin-top: 1rem;
`;
