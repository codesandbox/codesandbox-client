import React from 'react';
import { Legend, Dot, LegendLi } from './elements';

const Info = () => (
  <Legend>
    <LegendLi>
      <Dot /> 100% uptime
    </LegendLi>
    <LegendLi>
      <Dot down /> Downtime
    </LegendLi>
  </Legend>
);

export default Info;
