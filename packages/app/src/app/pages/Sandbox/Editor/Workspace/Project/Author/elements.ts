import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const UserLink = styled(Link)`
  ${({ theme }) => css`
    display: block;
    color: ${theme[`editor.foreground`] || css`rgba(255, 255, 255, 0.8)`};
    font-size: 0.875rem;
    text-decoration: none;
  `}
`;
