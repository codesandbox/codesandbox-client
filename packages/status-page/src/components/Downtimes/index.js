import React from 'react';
import { isAfter, subDays, differenceInDays, format } from 'date-fns';

import {
  Alias,
  Data,
  Header,
  Service,
  Services,
  Status,
  AllStatus,
  Legend,
  Dot,
  LegendLi,
  Info,
  Tooltip,
  Circle,
} from './elements';

const MainFooter = () => (
  <Legend>
    <LegendLi>
      <Dot /> 100% uptime
    </LegendLi>
    <LegendLi>
      <Dot down /> Downtime
    </LegendLi>
  </Legend>
);

const Downtimes = ({ downtimes }) => {
  const lastMonth = downtimes
    .map(({ product, downtimes }) => {
      return {
        product,
        downtimes: downtimes
          .filter(downtime =>
            isAfter(downtime.started_at, subDays(new Date(), 30))
          )
          .map(downtime => ({
            ...downtime,
            from30: 30 - differenceInDays(new Date(), downtime.started_at),
          })),
      };
    })
    .sort((a, b) => {
      if (a.product.alias < b.product.alias) {
        return -1;
      }
      if (a.product.alias > b.firstname) {
        return 1;
      }
      return 0;
    });
  var empty = Array.from(Array(30).keys());
  const five = Array.from(Array(5).keys());

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
        <MainFooter />
      </>
    );
  }
  return (
    <>
      <Services>
        {lastMonth.map(({ product }) => (
          <Service key={product.token}>
            <Header>
              <Alias>{product.alias}</Alias>
              <Data>
                {product.uptime.toFixed(2)}% uptime for the last 30 days
              </Data>
            </Header>
            <AllStatus>
              {empty.map((_, i) => {
                const down = lastMonth.find(a =>
                  a.downtimes.find(
                    b => b.from30 === i + 1 && a.product.token === product.token
                  )
                );
                const show =
                  down && down.downtimes.find(b => b.from30 === i + 1);

                return (
                  <div style={{ position: 'relative' }}>
                    <Status key={i} down={down} />
                    <Tooltip>
                      {show ? (
                        <>
                          <Info>{format(show.started_at, 'dddd D MMMM')}</Info>
                          <Info bold>
                            Down for {Math.floor(show.duration / 60)}m
                          </Info>
                        </>
                      ) : (
                        <Info>
                          <Circle />
                          100% Online
                        </Info>
                      )}
                    </Tooltip>
                  </div>
                );
              })}
            </AllStatus>
          </Service>
        ))}
      </Services>
      <MainFooter />
    </>
  );
};

export default Downtimes;
