import styled, { css } from 'styled-components';

export const ITEM_HEIGHT = 36;

export const Item = styled.div`
  display: flex;
  align-items: center;
  transition: 0.3s ease all;
  position: absolute;
  top: ${props => props.top}px;
  left: 0;
  right: 0;
  height: ${ITEM_HEIGHT - 2}px;
  line-height: ${ITEM_HEIGHT - 2}px;
  margin: 1px 1rem;
  padding: 0 1rem;
  z-index: 1;
  cursor: pointer;
  border-radius: 4px;

  ${props =>
    !props.selected &&
    css`
      &:hover {
        color: ${props.theme.colors.button.foreground};
        background-color: ${props.theme.colors.button.background};
      }
    `};
`;

export const Selector = styled.div`
  transition: 0.2s ease all;
  position: absolute;
  top: 0px;
  left: 1rem;
  right: 1rem;
  height: ${ITEM_HEIGHT - 2}px;
  border-radius: 2px;
  z-index: 0;
  background-color: ${props => props.theme.colors.button.background};

  transform: translateY(${props => props.offset + 1}px);
`;
