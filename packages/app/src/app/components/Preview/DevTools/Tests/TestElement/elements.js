import styled, { css } from 'styled-components';

import Check from 'react-icons/lib/go/check';
import Cross from 'react-icons/lib/go/x';
import DotIcon from 'react-icons/lib/go/primitive-dot';
import LoadingBubbles from './LoadingBubbles';

export const Container = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const FileData = styled.div`
  transition: 0.3s ease background-color;
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);

  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const Path = styled.span`
  color: rgba(255, 255, 255, 0.6);
`;

export const FileName = styled.span`
  color: rgba(255, 255, 255, 0.8);
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

export const Tests = styled.div`
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  overflow-x: auto;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

export const Test = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  background-color: #181b1d;

  ${props =>
    props.status === 'idle' &&
    css`
      color: rgba(255, 255, 255, 0.4);
    `};
`;

export const Block = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  position: relative;
  margin-right: ${props => (props.last ? 0 : 12)}px;
  color: rgba(255, 255, 255, 0.5);

  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    margin: auto;
    top: 3px;
    right: -10px;
    width: 17px;
    height: 17px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    border-right: 1px solid rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    background-color: #181b1d;
    z-index: 1;
  }
`;

export const TestName = styled.div`
  padding: 0.25rem;
  padding-left: 20px;
  background-color: ${props => props.theme.background2};
  color: rgba(255, 255, 255, 0.8);
  flex: auto;
  white-space: nowrap;
`;
