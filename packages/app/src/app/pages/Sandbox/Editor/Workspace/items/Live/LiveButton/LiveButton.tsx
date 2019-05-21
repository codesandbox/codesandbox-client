import React, { useState } from 'react';

import { useInterval } from 'app/hooks';

import { AnimatedRecordIcon, Button, LoadingDiv } from './elements';

export const LiveButton = ({
  disable,
  icon = true,
  isLoading,
  message = 'Go Live',
  onClick,
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

  const startHovering = () => setHovering(true);
  const stopHovering = () => setHovering(false);

  if (isLoading) {
    return <LoadingDiv>Creating Session</LoadingDiv>;
  }

  return (
    <Button
      disable={disable}
      onMouseEnter={startHovering}
      onMouseLeave={stopHovering}
      onClick={onClick}
    >
      {/*
       // @ts-ignore */}
      {icon && <AnimatedRecordIcon opacity={Number(showIcon)} />} {message}
    </Button>
  );
};
