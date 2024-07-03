import React, { FunctionComponent, useEffect, useState } from 'react';
import ErrorIcon from 'react-icons/lib/md/error';

import { Container, RedIcon, SVGIcon } from './elements';
import { getIconURL } from './getIconURL';

type Props = {
  error?: boolean;
  height?: number;
  type: string;
  width?: number;
};

export const EntryIcons: FunctionComponent<Props> = ({
  error,
  height = 16,
  type,
  width = 16,
}) => {
  const [icon, setIcon] = useState<string>(null);

  useEffect(() => {
    const fetchIconURL = async () => {
      const iconURL = await getIconURL(type);

      setIcon(iconURL);
    };

    fetchIconURL();
  }, [type]);

  const Icon = () =>
    error ? (
      <RedIcon height={height} width={width}>
        <ErrorIcon height={height} width={width} />
      </RedIcon>
    ) : (
      <SVGIcon height={height} url={icon} width={width} />
    );

  return (
    <Container>
      <Icon />
    </Container>
  );
};
