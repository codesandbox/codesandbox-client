import React from 'react';
import css from '@styled-system/css';
import { AnimatePresence, motion } from 'framer-motion';
import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { TippyProps } from '@tippy.js/react';
import { useOvermind } from 'app/overmind';
import { Stack, Avatar, Text } from '@codesandbox/components';

interface ICollaboratorHeadProps {
  avatarUrl: string;
  username: string;
  id: string;
  color: number[];
  isCurrentUser: boolean;
  showBorder?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  singleton: TippyProps['singleton'];
}

const HEAD_SIZE = 26;

const CollaboratorHead = (props: ICollaboratorHeadProps) => (
  <Tooltip
    singleton={props.singleton}
    interactive
    style={{ display: 'flex' }}
    content={
      <Stack
        css={css({ paddingX: 2, paddingY: 1 })}
        justify="center"
        align="center"
        gap={1}
        direction="vertical"
      >
        <Text>
          {props.username}
          {props.isCurrentUser && ' (you)'}
        </Text>
        <Text variant="muted">View Profile</Text>
      </Stack>
    }
  >
    <button
      type="button"
      css={{
        position: 'relative',
        width: HEAD_SIZE,
        height: HEAD_SIZE,
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',

        ':after': props.showBorder && {
          content: " ' '",
          position: 'absolute',
          display: 'block',
          borderRadius: 2,
          top: 0,
          width: '100%',
          height: '100%',
          boxShadow: `inset 0px 0px 0px 1.5px rgb(${props.color.join(',')})`,
        },
      }}
      onClick={props.onClick}
    >
      <Avatar
        user={{
          id: props.id,
          username: props.username,
          avatarUrl: props.avatarUrl,
        }}
        css={css({
          width: HEAD_SIZE,
          height: HEAD_SIZE,
          img: {
            border: 'none',
          },
        })}
      />
    </button>
  </Tooltip>
);

export const CollaboratorHeads = () => {
  const { state } = useOvermind();
  const liveUsers = state.live.roomInfo.users;

  const liveUserId = state.live.liveUserId;
  const orderedLiveUsers = React.useMemo(() => {
    const currentUser = liveUsers.find(u => u.id === liveUserId);
    const liveUsersWithoutCurrentUser = liveUsers.filter(
      u => u.id !== liveUserId
    );
    return [currentUser, ...liveUsersWithoutCurrentUser];
  }, [liveUserId, liveUsers]);

  return (
    <Stack justify="center">
      <SingletonTooltip>
        {singleton => (
          <AnimatePresence>
            {orderedLiveUsers.map((user, i) => (
              <motion.div
                positionTransition
                style={{
                  zIndex: 10 + liveUsers.length - i,
                  display: 'flex',
                  alignItems: 'center',
                }}
                animate={{ width: 'auto', marginRight: 8, opacity: 1 }}
                exit={{ width: 0, marginRight: 0, opacity: 0 }}
                initial={{ width: 0, marginRight: 0, opacity: 0 }}
                key={user.id}
              >
                <CollaboratorHead
                  avatarUrl={user.avatarUrl}
                  username={user.username}
                  color={user.color}
                  id={user.id}
                  singleton={singleton}
                  isCurrentUser={user.id === liveUserId}
                  showBorder
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </SingletonTooltip>
    </Stack>
  );
};
