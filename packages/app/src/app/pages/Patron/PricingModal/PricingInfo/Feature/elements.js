import styled, { css } from 'styled-components';

export const Container = styled.tr`
  margin: 1rem 0;
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);

  ${props =>
    props.disabled &&
    css`
      opacity: 0.5;
    `};
`;

export const Feature = styled.td`
  text-align: right;
  padding: 1rem 0;
  padding-right: 2rem;
`;

export const Value = styled.td`
  text-align: center;
  padding: 0 2rem;
  font-weight: 300;

  ${props =>
    props.supporter &&
    css`
      background-color: rgba(0, 0, 0, 0.3);
    `};
`;
