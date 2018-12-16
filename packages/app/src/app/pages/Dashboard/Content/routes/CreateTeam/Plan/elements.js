import styled, { css } from 'styled-components';

export const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
`;

export const Container = styled.div`
  transition: 0.3s ease border-color;
  border-radius: 4px;
  padding: 1rem;
  border: 2px solid rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.8);

  background-color: ${props => props.theme.background};
  margin-bottom: 1.5rem;

  cursor: pointer;

  ${props =>
    props.selected
      ? css`
          border-color: ${props.theme.shySecondary};
        `
      : css`
          &:hover {
            border-color: ${props.theme.shySecondary.clearer(0.6)};
          }
        `};
`;

export const Name = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: white;
`;

export const Points = styled.div`
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.6;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
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
