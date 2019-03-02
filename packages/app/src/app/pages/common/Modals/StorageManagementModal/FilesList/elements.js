import styled, { css } from 'styled-components';
import delayEffect from 'common/lib/utils/animation/delay-effect';

export const HeaderTitle = styled.th`
  font-weight: 400;
  text-align: left;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
`;

export const Buttons = styled.div`
  margin: 0.5rem 0;
  display: flex;

  > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

export const Table = styled.table`
  ${delayEffect(0.2)};
  width: 100%;
  border-spacing: 0;
  background-color: ${props => props.theme.background2};
`;

export const StatBody = styled.td`
  width: 2rem;
  text-align: center;
`;

export const Body = styled.tbody`
  margin-top: 3rem;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.theme.background2};

  td {
    border: none;
    padding: 1rem 0.5rem;
    margin: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;

export const FileRow = styled.tr`
  transition: 0.3s ease all;
  ${props => delayEffect(0.25 + props.index * 0.05, false)};
  border: none;
  margin: 0;

  &:hover {
    background-color: ${props => props.theme.primary.clearer(0.9)};
    color: rgba(255, 255, 255, 0.9);
  }
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
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin-left: 1rem;
  box-shadow: none;
  display: inline-block;
  border-radius: 3.5px;
  width: 16px;
  height: 16px;
  outline: none;
  vertical-align: middle;
  transition: 0.15s ease all;
  cursor: pointer;
`;
