// @flow
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme.background2};
  height: calc(100% - 2.5rem);
`;

export const Tabs = styled.div`
  display: flex;
  height: 2.5rem;
  min-height: 2.5rem;
  background-color: rgba(0, 0, 0, 0.3);
  overflow-x: auto;

  -ms-overflow-style: none; // IE 10+
  overflow: -moz-scrollbars-none; // Firefox

  &::-webkit-scrollbar {
    height: 2px; // Safari and Chrome
  }
`;

export const Split = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${props => (props.show ? `${props.size}%` : '0px')};
  max-width: ${props => (props.only ? '100%' : `${props.size}%`)};
  min-width: ${props => (props.only ? '100%' : `${props.size}%`)};
  height: 100%;
`;
