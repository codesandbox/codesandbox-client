import React from 'react';
import { Property, Number, Container } from './elements';
import { formatNumber } from './formatNumber';

interface IStatProps {
  name: string;
  count: number;
}

export const Stat: React.FC<IStatProps> = ({ name, count }) => (
  <Container>
    <Property>{name}</Property>
    <Number>{formatNumber(count)}</Number>
  </Container>
);
