import React from 'react';

import Tooltip from '../Tooltip';
import Legend from '../Legend';
import { lastMonth, empty, five } from './fn';
import {
  Alias,
  Data,
  Header,
  Service,
  Services,
  Status,
  AllStatus,
} from './elements';

const Downtimes = ({ downtimes }) => {
  if (!downtimes.length) {
    return (
      <>
        <Services>
          {five.map(i => (
            <Service key={i}>
              <Header>
                <Alias>Getting data</Alias>
              </Header>
              <AllStatus>
                {empty.map((_, i) => {
                  return <Status key={i} loading />;
                })}
              </AllStatus>
            </Service>
          ))}
        </Services>
        <Legend />
      </>
    );
  }
  return (
    <>
      <Services>
        {lastMonth(downtimes).map(({ product }) => (
          <Service key={product.token}>
            <Header>
              <Alias>{product.alias}</Alias>
              <Data>
                {product.uptime.toFixed(2)}% uptime for the last 30 days
              </Data>
            </Header>
            <AllStatus>
              {empty.map((_, i) => {
                const down = lastMonth(downtimes).find(a =>
                  a.downtimes.find(
                    b => b.from30 === i + 1 && a.product.token === product.token
                  )
                );
                return (
                  <div style={{ position: 'relative' }}>
                    <Status key={i} down={down} />
                    <Tooltip
                      show={
                        down && down.downtimes.find(b => b.from30 === i + 1)
                      }
                    />
                  </div>
                );
              })}
            </AllStatus>
          </Service>
        ))}
      </Services>
      <Legend />
    </>
  );
};

export default Downtimes;
