import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';
import Tooltip from 'common/components/Tooltip';

const blink = keyframes`
	0% {color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};}
	50%{color: rgba(255, 255, 255, 1);}
	100% {color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};}
`;

const styles = props =>
  css`
    ${props.blink &&
      css`
        animation: ${blink} 1s infinite;
        font-weight: 600;
      `};
    display: flex !important;
    transition: 0.3s ease all;
    flex-direction: row;
    align-items: center;
    vertical-align: middle;
    font-size: 0.875rem;
    line-height: 1;
    height: 100%;
    color: ${props.theme.light ? '#636363' : 'rgba(255, 255, 255, 0.7)'};
    cursor: pointer;
    box-sizing: inherit;
    border-bottom: 2px solid transparent;
    z-index: 1;
    ${props.highlight
      ? css`
          background-color: ${props.theme.secondary.darken(0.1)()};
          color: rgba(255, 255, 255, 0.7);
          border-bottom: 1px solid ${props.theme.secondary.darken(0.1)()};

          &:hover {
            background-color: ${props.theme.secondary.darken(0.2)()};
          }
        `
      : css`
          &:hover {
            color: ${props.theme['editor.foreground'] ||
              (props.theme.light ? 'black' : 'white')};
            border-color: ${props.hideBottomHighlight
              ? 'transparent'
              : props.theme.secondary()};
          }
        `};
  `;

export const Title = styled.span`
  padding-left: 0.5rem;
`;

export const Action = styled.div`
  ${styles};
`;

export const ActionLink = styled(Link)`
  ${styles};
  text-decoration: none;
`;

export const ActionA = styled.a`
  ${styles};
  text-decoration: none;
`;

export const ActionTooltip = styled(Tooltip)`
  ${styles};
  ${props =>
    props.disabledAction &&
    css`
      color: ${props.theme.light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'};
      cursor: default;

      &:hover {
        color: ${props.theme.light
          ? 'rgba(0,0,0,0.4)'
          : 'rgba(255,255,255,0.4)'};
      }
    `};
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 0.75rem;
`;
