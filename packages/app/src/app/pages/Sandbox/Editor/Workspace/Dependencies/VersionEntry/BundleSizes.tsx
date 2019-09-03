import React, { useEffect, useState } from 'react';
import { MoreData } from './elements';

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
  selectedDep: string;
};

export const BundleSizes = ({ dependency, selectedDep = '' }: Props) => {
  const [size, setSize] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cleanVersion = selectedDep.split('^');
    getSizeForPKG(`${dependency}@${cleanVersion[cleanVersion.length - 1]}`);
  }, [dependency, selectedDep]);

  const getSizeForPKG = (pkg: string) => {
    fetch(`https://bundlephobia.com/api/size?package=${pkg}`)
      .then(rsp => rsp.json())
      .then(setSize)
      .catch(setError);
  };

  if (error) {
    return (
      <MoreData>There was a problem getting the size for {dependency}</MoreData>
    );
  }

  return size ? (
    <MoreData>
      <li>
        <span>Gzip:</span> {formatSize(size.gzip)}
      </li>
      <li>
        <span>Size:</span> {formatSize(size.size)}
      </li>
    </MoreData>
  ) : null;
};
