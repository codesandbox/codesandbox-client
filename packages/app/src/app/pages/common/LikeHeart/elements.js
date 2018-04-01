import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: inline-block;
  transition: 0.3s ease all;

  transform: scale(1);

  ${props =>
    props.loggedIn &&
    css`
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    `};
`;
