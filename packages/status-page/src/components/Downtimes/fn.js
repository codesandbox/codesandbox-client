import { isAfter, subDays, differenceInDays } from 'date-fns';

export const empty = Array.from(Array(30).keys());
export const five = Array.from(Array(5).keys());

export const lastMonth = downtimes =>
  downtimes
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
