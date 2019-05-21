import React, { useState } from 'react';
import { useInterval } from 'app/hooks';
import { Button, LoadingDiv, AnimatedRecordIcon } from './elements';

export const LiveButton = ({
  onClick,
  isLoading,
  disable,
  icon = true,
  message = 'Go Live',
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
