import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const NavigationLink = styled(Link)`
  transition: 0.3s ease color;
  margin-right: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: white;
  }

  ${props =>
    props.last
      ? css`
          color: white;
        `
      : css`
          &::after {
            content: '›';
            margin-left: 0.5rem;
          }
        `};
`;

export const OrderBy = styled.div`
  position: absolute;
  right: 2rem;

  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
`;

export const OrderName = styled.span`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.8);

  cursor: pointer;

  &:hover {
    color: white;
  }
`;
