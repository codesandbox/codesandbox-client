import React from 'react';
import styled, { css } from 'styled-components';

const Container = styled.tr`
  margin: 1rem 0;
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);

  ${props => props.disabled && css`opacity: 0.5;`};
`;

const Feature = styled.td`
  text-align: right;
  padding: 1rem 0;
  padding-right: 2rem;
`;

const Value = styled.td`
  text-align: center;
  padding: 0 2rem;
  font-weight: 300;

  ${props => props.supporter && css`background-color: rgba(0, 0, 0, 0.3);`};
`;

type Props = {
  feature: string,
  free: string,
  supporter: string,
  disabled: boolean,
};

export default ({ disabled, feature, free, supporter }: Props) => (
  <Container disabled={disabled}>
    <Feature>{feature}</Feature>
    <Value>{free}</Value>
    <Value supporter>{supporter}</Value>
  </Container>
);
