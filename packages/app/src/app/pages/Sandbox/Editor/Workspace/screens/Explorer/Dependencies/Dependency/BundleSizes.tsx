import { Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useState } from 'react';

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

type Bundle = {
  gzip: number;
  size: number;
};
type Props = {
  dependency: string;
  version: string;
};
export const BundleSizes: FunctionComponent<Props> = ({
  dependency,
  version,
}) => {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [error, setError] = useState(null);

  const getSizeForPKG = (pkg: string) => {
    fetch(`https://bundlephobia.com/api/size?package=${pkg}`)
      .then(response => response.json())
      .then(setBundle)
      .catch(setError);
  };
  useEffect(() => {
    const cleanVersion = version.split('^');
    getSizeForPKG(`${dependency}@${cleanVersion[cleanVersion.length - 1]}`);
  }, [dependency, version]);

  if (error) {
    return (
      <Text marginBottom={2} variant="muted">
        There was a problem getting the size for {dependency}
      </Text>
    );
  }

  return bundle ? (
    <Stack justify="space-between" css={{ width: '100%' }}>
      <Text>
        <Text variant="muted">Gzip: </Text>

        {formatSize(bundle.gzip)}
      </Text>

      <Text>
        <Text variant="muted">Size: </Text>

        {formatSize(bundle.size)}
      </Text>
    </Stack>
  ) : null;
};
