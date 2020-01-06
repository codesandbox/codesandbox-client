import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import React, { FunctionComponent, MouseEvent } from 'react';
import BellIcon from 'react-icons/lib/md/notifications';

import { useOvermind } from 'app/overmind';

import { Action, UnreadIcon } from '../elements';

type Props = {
  openNotifications: (event: MouseEvent<HTMLDivElement>) => void;
};
export const ShowNotificationsAction: FunctionComponent<Props> = ({
  openNotifications,
}) => {
  const {
    state: {
      userNotifications: { unreadCount },
    },
  } = useOvermind();

  return (
    <Action
      aria-label={unreadCount > 0 ? 'Show Notifications' : 'No Notifications'}
      as="button"
      onClick={openNotifications}
      style={{ fontSize: '1.25rem', position: 'relative' }}
    >
      <Tooltip
        content={unreadCount > 0 ? 'Show Notifications' : 'No Notifications'}
        placement="bottom"
      >
        <BellIcon height={35} />

        {unreadCount > 0 && <UnreadIcon />}
      </Tooltip>
    </Action>
  );
};
