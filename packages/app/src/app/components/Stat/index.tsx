import React from 'react';
import { Property, Number, Container } from './elements';

interface IStatProps {
  name: string;
  count: number;
}

export const formatNumber = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return `${count}`;
};

const Stat = ({ name, count }: IStatProps) => (
  <Container>
    <Property>{name}</Property>
    <Number>{formatNumber(count)}</Number>
  </Container>
);

export default Stat;
