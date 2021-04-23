import { Text } from '@codesandbox/components';
import React, { FunctionComponent, useState } from 'react';
import useInterval from 'use-interval';
import { useAppState } from 'app/overmind';

const pad = (number: number) => {
  if (`${number}`.length === 1) {
    return `0${number}`;
  }

  return `${number}`;
};

export const Timer: FunctionComponent = () => {
  const {
    roomInfo: { startTime },
  } = useAppState().live;
  const [since, setSince] = useState(Date.now() - startTime);

  useInterval(() => {
    setSince(Date.now() - startTime);
  }, 1000);

  const hours = Math.floor(since / 1000 / 60 / 60);
  const minutes = Math.floor((since - hours * 1000 * 60 * 60) / 1000 / 60);
  const seconds = Math.floor(
    (since - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000
  );

  const text = `${hours > 0 ? pad(hours) + ':' : ''}${pad(minutes)}:${pad(
    seconds
  )}`;

  return <Text variant="danger">{text}</Text>;
};
