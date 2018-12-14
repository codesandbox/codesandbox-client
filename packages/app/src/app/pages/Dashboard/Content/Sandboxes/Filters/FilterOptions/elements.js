import styled, { css } from 'styled-components';

export const Container = styled.div`
  transition: 0.3s ease opacity;
  position: relative;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;

  margin-right: 1rem;
  vertical-align: middle;

  ${props =>
    props.hideFilters &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `};
`;

export const TemplatesName = styled.span`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export const OverlayContainer = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  right: 0;
  text-align: left;
  line-height: 1.6;
  width: 200px;
  padding: 1rem;
  z-index: 10;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;

  border-radius: 2px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);

  background-color: ${props => props.theme.background};
`;

export const OptionName = styled.span`
  font-weight: 600;
  cursor: pointer;
`;

export const Option = styled.div`
  transition: 0.3s ease color;
  cursor: pointer;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  margin-bottom: 0.25rem;

  &:hover {
    color: rgba(255, 255, 255, 0.9);

    ${props =>
      !props.selected &&
      css`
        span {
          border-color: rgba(255, 255, 255, 0.1);
        }
      `};
  }

  &:last-child {
    margin-bottom: 0;
  }

  ${props =>
    props.selected &&
    css`
      color: white;
    `};
`;

export const CheckBox = styled.span`
  ${props =>
    props.selected
      ? css`
          background: ${props.color} url('') no-repeat 50%/10px;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 10 9' xmlns='http://www.w3.org/2000/svg'><path d='M1 4.88l2.378 2.435L9.046 1.6' stroke-width='1.6' stroke='%23FFF' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'/></svg>");
        `
      : css`
          background: rgba(0, 0, 0, 0.3) url('') no-repeat 50%/10px;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 10 9' xmlns='http://www.w3.org/2000/svg'><path fill='rgba(255, 255, 255, 0.2)/></svg>");
        `};
  border: 2px solid transparent;

  ${props =>
    props.selected &&
    css`
      border-color: ${props.color};
    `};
  box-shadow: none;
  display: inline-block;
  border-radius: 3.5px;
  width: 16px;
  height: 16px;
  outline: none;
  vertical-align: middle;
  margin-right: 0.75rem;
  transition: 0.15s ease all;
  cursor: pointer;
`;
