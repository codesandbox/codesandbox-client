import styled from 'styled-components';

import { animated } from 'react-spring/renderprops';
import theme from '@codesandbox/common/lib/theme';

export const Container = styled(animated.div)`
  position: fixed;

  font-size: 0.75rem;
  background-color: ${() => theme.background4()};
  color: rgba(255, 255, 255, 0.6);
  box-shadow: -1px 3px 4px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 40;
  overflow: hidden;
  padding: 4px 0;

  transform-origin: 0% 0%;
  font-weight: 600;
`;

export const Item = styled.button`
  transition: 0.2s ease all;
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;

  border: none;
  outline: none;
  background-color: transparent;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;

  border-left: 2px solid transparent;
  cursor: pointer;

  width: 100%;
  min-width: 10rem;

  svg {
    margin-right: 0.75rem;
    font-size: 0.75rem;
    width: 1rem;
  }

  &:last-child {
    border-bottom-color: transparent;
  }

  &:hover {
    color: ${props => (props.color ? props.color : theme.secondary())};
    background-color: ${() => theme.background2.lighten(0.3)()};
    border-left-color: ${props =>
      props.color ? props.color : theme.secondary()};
  }

  &:focus {
    color: ${props => (props.color ? props.color : theme.secondary())};
    background-color: ${() => theme.background2.lighten(0.3)()};
    border-left-color: ${props =>
      props.color ? props.color : theme.secondary()};
  }
`;

export const ItemContainer = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 4px;
  margin-bottom: 4px;

  &:last-child {
    border-bottom: inherit;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`;

export const Badge = styled.p`
  margin: 0 0 0 4px;
  border-radius: 2px;
  background-color: ${opts => opts.theme.colors.blues[700]};
  color: ${opts => opts.theme.colors.white};
  width: ${opts => opts.theme.sizes[7]}px;
  height: ${opts => opts.theme.sizes[3]}px;
  text-align: center;
  line-height: 1.4;
  font-size: ${opts => opts.theme.fontSizes[1]}px;
  font-weight: ${opts => opts.theme.fontWeights.medium};
  position: relative;
  top: -1px;
`;
