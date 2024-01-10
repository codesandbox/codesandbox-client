import styled, { css } from 'styled-components';

import Check from 'react-icons/lib/go/check';
import Cross from 'react-icons/lib/go/x';
import DotIcon from 'react-icons/lib/go/primitive-dot';
import { LoadingBubbles } from './LoadingBubbles';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  background-color: ${props => props.theme['sideBar.background']};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

export const TestContainer = styled.div`
  flex: 2;
  box-sizing: border-box;
  overflow-y: auto;
  min-width: 450px;
  background-color: ${props => props.theme['sideBar.background']};
  height: 100%;
`;

export const TestDetails = styled.div`
  flex: 3;
  background-color: ${props => props.theme['sideBar.background']};
  height: 100%;
`;

const iconStyles = css`
  margin-right: 0.25rem;
  font-size: 1.125em;
  flex: 0 0 1.125em;
`;

const Loading = styled(LoadingBubbles)`
  ${iconStyles};
  color: ${props => props.theme.secondary};
`;

const Success = styled(Check)`
  ${iconStyles};
  color: ${props => props.theme.green};
`;

const Fail = styled(Cross)`
  ${iconStyles};
  color: ${props => props.theme.red};
`;

const Dot = styled(DotIcon)`
  ${iconStyles};
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
`;

export const StatusElements = {
  pass: Success,
  fail: Fail,
  running: Loading,
  idle: Dot,
};

export const Tests = styled.div`
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;

  /* Using absolute for correct scrolling, browsers have trouble handling
   * an inner scroll inside a container unless the child is absolute */
  position: absolute;
  top: 3.5rem;
  bottom: 0;
  left: 0;
  right: 0;
`;
