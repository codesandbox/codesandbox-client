import { useState } from 'react';

import { useInterval } from 'app/hooks';

export const SessionTimer = ({ startTime }) => {
  const [elapsed, setElapsed] = useState(`00:00`);

  const pad = (val: number) => (`${val}`.length === 1 ? `0${val}` : `${val}`);

  const getTimes = () => {
    const delta = Date.now() - startTime;

    const hours = Math.floor(delta / 1000 / 60 / 60);
    const minutes = Math.floor((delta - hours * 1000 * 60 * 60) / 1000 / 60);
    const seconds = Math.floor(
      (delta - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000
    );

    return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
  };

  const { hours, minutes, seconds } = getTimes();

  useInterval(() => {
    setElapsed(`${Number(hours) > 0 ? `${hours}:` : ``}${minutes}:${seconds}`);
  }, 1000);

  return elapsed;
};
