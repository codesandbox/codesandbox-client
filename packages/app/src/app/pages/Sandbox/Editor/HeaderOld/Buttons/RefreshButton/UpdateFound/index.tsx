import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { ComponentProps, FunctionComponent, useState } from 'react';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { useInterval } from 'app/hooks';

import { Container, Message } from './elements';

type Props = ComponentProps<typeof Container>;
export const UpdateFound: FunctionComponent<Props> = props => {
  const [visible, setVisibility] = useState(true);
  useInterval(() => setVisibility(false), visible ? 60000 : null);

  return (
    <Container {...props}>
      <Tooltip
        arrow
        content={
          <Message
            id="update-message"
            onClick={() => document.location.reload()}
          />
        }
        distance={15}
        theme="update"
        trigger={visible ? 'manual' : 'mouseenter focus'}
        visible={visible}
      >
        <RefreshIcon />
      </Tooltip>
    </Container>
  );
};
