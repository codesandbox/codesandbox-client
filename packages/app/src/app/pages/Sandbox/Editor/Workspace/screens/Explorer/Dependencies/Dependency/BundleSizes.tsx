import React, { useEffect, useState } from 'react';
import { Stack, Text } from '@codesandbox/components';

const formatSize = (value: number) => {
  let unit: string;
  let size: number;
  if (Math.log10(value) < 3) {
    unit = 'B';
    size = value;
  } else if (Math.log10(value) < 6) {
    unit = 'kB';
    size = value / 1024;
  } else {
    unit = 'mB';
    size = value / 1024 / 1024;
  }

  return `${size.toFixed(1)}${unit}`;
};

type Props = {
  dependency: string;
  version: string;
};

export const BundleSizes = ({ dependency, version = '' }: Props) => {
  const [size, setSize] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanVersion = version.split('^');
    getSizeForPKG(`${dependency}@${cleanVersion[cleanVersion.length - 1]}`);
  }, [dependency, version]);

  const getSizeForPKG = (pkg: string) => {
    fetch(`https://bundlephobia.com/api/size?package=${pkg}`)
      .then(rsp => rsp.json())
      .then(setSize)
      .catch(setError);
  };

  if (error) {
    return (
      <Text variant="muted" marginBottom={2}>
        There was a problem getting the size for {dependency}
      </Text>
    );
  }

  return size ? (
    <Stack justify="space-between" css={{ width: '100%' }}>
      <Text>
        <Text variant="muted">Gzip:</Text> {formatSize(size.gzip)}
      </Text>
      <Text>
        <Text variant="muted">Size:</Text> {formatSize(size.size)}
      </Text>
    </Stack>
  ) : null;
};
