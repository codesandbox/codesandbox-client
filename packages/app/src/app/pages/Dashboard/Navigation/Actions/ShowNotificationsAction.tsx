import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { MdNotifications } from 'react-icons/md';

import { Action, UnreadIcon } from '../elements';

type Props = {
  openNotifications: (
    event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => void;
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
        <MdNotifications height={35} />

        {unreadCount > 0 && <UnreadIcon />}
      </Tooltip>
    </Action>
  );
};
