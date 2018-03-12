import * as React from 'react';
import formatNumber from './format-number';
import { Property, Number, Stat } from './elements';

type Props = {
  count: number
  name: string
}

const StatComponent: React.SFC<Props> = ({ count, name }) => {
  return (
    <Stat>
      <Property>{name}</Property>
      <Number>{formatNumber(count)}</Number>
    </Stat>
  );
}

export default StatComponent;
