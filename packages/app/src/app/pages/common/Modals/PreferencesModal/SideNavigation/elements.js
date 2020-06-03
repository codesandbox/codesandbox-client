import styled, { css } from 'styled-components';

export const Container = styled.div`
  flex: 1;
  background-color: ${props => props.theme.background2};
  width: 100%;
  padding-bottom: 5rem;
`;

export const Title = styled.h2`
  font-weight: 500;
  padding: 2rem;
  margin-top: 0 !important;
  font-size: 1.125rem;
  margin: 0;
  text-transform: uppercase;
`;

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
  font-weight: 500;
  z-index: 1;
  cursor: pointer;
  border-radius: 4px;
  color: ${props => (props.selected ? 'white' : 'rgba(255, 255, 255, 0.4)')};

  ${props =>
    !props.selected &&
    css`
      &:hover {
        color: rgba(255, 255, 255, 0.6);
        background-color: ${styleProps => styleProps.theme.background};
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
  border-radius: 4px;
  z-index: 0;
  background-color: ${props => props.theme.secondary};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);

  transform: translateY(${props => props.offset + 1}px);
`;
