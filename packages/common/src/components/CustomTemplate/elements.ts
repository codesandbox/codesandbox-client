import styled, { css } from 'styled-components';
import { Overlay } from '../SandboxCard/elements';

export const Border = styled.div<{ color?: string }>`
  ${({ color = `none` }) => css`
    position: relative;
    top: -4px;
    width: 100%;
    height: 4px;
    background: ${color};
  `}
`;

export const TemplateTitle = styled.span`
  display: block;
  width: 100%;
  margin: 6px 12px;
  font-family: Poppins, Roboto, sans-serif;
  font-size: 12px;
  font-weight: 500;
  text-align: left;
`;

export const TemplateSubTitle = styled.span`
  ${({ theme }) => css`
    display: block;
    width: 100%;
    height: 16px;
    padding: 0 12px;
    margin-bottom: 6px;
    color: ${theme.placeholder};
    font-size: 12px;
    text-align: left;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  `}
`;

export const MyTemplate = styled.button<{ overlayHeight?: number }>`
  ${({ theme, overlayHeight }) => css`
    position: relative;
    width: 203.5px;
    min-width: 203.5px;
    padding: 0;
    border: 2px solid ${theme.background5};
    border-radius: 4px;
    background: ${theme.background2};
    color: ${theme.lightText};
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;

    &:focus {
      border: 2px solid ${theme.secondary};
      outline: none;
    }

    img {
      display: block;
      max-width: 100%;
    }

    ${Overlay} {
      height: ${overlayHeight}px;
      text-align: left;
    }

    &:hover {
      ${Overlay} {
        opacity: 1;
      }
    }
  `}
`;
