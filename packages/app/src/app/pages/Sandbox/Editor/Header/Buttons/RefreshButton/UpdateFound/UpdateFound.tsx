import React, { useState, useEffect, useRef } from 'react';
import RefreshIcon from 'react-icons/lib/md/refresh';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { UpdateContainer, UpdateMessage } from './elements';

const useInterval = (callback = () => {}, delay: number) => {
  const savedCallback: { current: () => void } = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
};

export const UpdateFound = (props: any) => {
  const [visible, setVisibility] = useState(true);
  useInterval(() => setVisibility(false), visible ? 60000 : null);

  return (
    <UpdateContainer {...props}>
      <Tooltip
        theme="update"
        content={
          <UpdateMessage
            id="update-message"
            onClick={() => document.location.reload()}
          />
        }
        visible={visible}
        trigger={visible ? 'manual' : 'mouseenter focus'}
        arrow
        distance={15}
      >
        <RefreshIcon />
      </Tooltip>
    </UpdateContainer>
  );
};
