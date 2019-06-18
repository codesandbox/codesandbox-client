import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const NavigationLink = styled(Link)`
  transition: 0.3s ease color;
  margin-right: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: white;
  }

  &:last-child {
    margin-right: 0;
  }

  ${props =>
    props.first
      ? css`
          margin-left: 0;
        `
      : css`
          margin-left: 0.5rem;
        `};

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
