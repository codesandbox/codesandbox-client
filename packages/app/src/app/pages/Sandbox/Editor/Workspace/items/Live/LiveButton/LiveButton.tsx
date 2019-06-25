import noop from 'lodash/noop';
import React, { useState } from 'react';

import { useInterval } from 'app/hooks';

import { AnimatedRecordIcon, Button, LoadingDiv } from './elements';

export const LiveButton = ({
  disable = false,
  icon = true,
  isLoading = false,
  message = 'Go Live',
  onClick = noop,
}) => {
  const [hovering, setHovering] = useState(false);
  const [showIcon, setShowIcon] = useState(icon);

  useInterval(
    () => {
      if (hovering) {
        setShowIcon(!showIcon);
      }
    },
    hovering ? 1000 : null
  );

  if (!hovering && !showIcon) {
    setShowIcon(true);
  }

  if (isLoading) {
    return <LoadingDiv>Creating Session</LoadingDiv>;
  }

  return (
    <Button
      disable={disable}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={onClick}
    >
      {/*
       // @ts-ignore */}
      {icon && <AnimatedRecordIcon opacity={Number(showIcon)} />} {message}
    </Button>
  );
};
