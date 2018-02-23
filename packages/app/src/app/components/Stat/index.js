import React from 'react';
import formatNumber from './format-number';
import { Property, Number, Stat } from './elements';

function StatComponent({ count, name }) {
  return (
    <Stat>
      <Property>{name}</Property>
      <Number>{formatNumber(count)}</Number>
    </Stat>
  );
}

export default StatComponent;
