import * as React from 'react';
import formatNumber from './format-number';
import { Property, Number, Stat } from './elements';

export type Props = {
  count: number;
  name: string;
};

const StatComponent: React.SFC<Props> = ({ count, name }) => (
  <Stat>
    <Property>{name}</Property>
    <Number>{formatNumber(count)}</Number>
  </Stat>
);

export default StatComponent;
