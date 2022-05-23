import React, { FunctionComponent, useEffect } from 'react';
import css from '@styled-system/css';
import { AnimatePresence, motion } from 'framer-motion';
import { sortBy } from 'lodash-es';
import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';
import { TippyProps } from '@tippy.js/react';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { Stack, Avatar, Text, Menu, Link } from '@codesandbox/components';
import { LiveUser } from '@codesandbox/common/lib/types';

interface ICollaboratorHeadProps {
  avatarUrl: string;
  username: string;
  id: string;
  color: number[];
  isCurrentUser: boolean;
  isDimmed: boolean;
  showBorder?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  singleton: TippyProps['singleton'];
}

const HEAD_SIZE = 26;
const USER_OVERFLOW_LIMIT = 4;

const CollaboratorHead = (props: ICollaboratorHeadProps) => (
  <Tooltip
    singleton={props.singleton}
    style={{ display: 'flex' }}
    content={
      <Stack
        css={css({ paddingX: 2, paddingY: 1 })}
        justify="center"
        align="center"
        gap={1}
        direction="vertical"
      >
        <Text size={3}>
          {props.username}
          {props.isCurrentUser && ' (you)'}
        </Text>
        <Link
          href={`/u/${props.username}`}
          target="_blank"
          rel="noreferrer noopener"
          size={2}
          variant="muted"
        >
          View Profile
        </Link>
      </Stack>
    }
  >
    <button
      type="button"
      css={{
        transition: '0.3s ease opacity',
        position: 'relative',
        width: HEAD_SIZE,
        height: HEAD_SIZE,
        overflow: 'hidden',
        cursor: 'pointer',
        padding: 0,
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none',
        opacity: props.isDimmed ? 0.5 : 1,

        ':hover': {
          opacity: 1,
        },

        ':after': props.showBorder && {
          content: " ' '",
          position: 'absolute',
          display: 'block',
          borderRadius: '100%',
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

export const CollaboratorHeads: FunctionComponent = () => {
  const state = useAppState();
  const actions = useActions();
  const effects = useEffects();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const liveUsers = state.live.roomInfo?.users || [];

  const liveUserId = state.live.liveUserId;
  const followingUserId = state.live.followingUserId;
  const orderedLiveUsers = React.useMemo(() => {
    const currentUser = liveUsers.find(u => u.id === liveUserId);
    const followingUser = liveUsers.find(u => u.id === followingUserId);
    const filteredLiveUsers = sortBy(
      liveUsers.filter(u => u.id !== liveUserId),
      'id'
    );

    if (followingUser) {
      const followingUserIndex = filteredLiveUsers.findIndex(
        u => u.id === followingUserId
      );

      const followingUserIsInFirst4 =
        followingUserIndex < USER_OVERFLOW_LIMIT - 1;
      if (!followingUserIsInFirst4) {
        // Let's move the following user to the start of the list if it's not in the first 4
        filteredLiveUsers.splice(followingUserIndex, 1);
        filteredLiveUsers.unshift(followingUser);
      }
    }

    return [currentUser, ...filteredLiveUsers].filter(Boolean);
  }, [liveUserId, followingUserId, liveUsers]);

  const followLiveUser = (user: LiveUser) => {
    if (liveUserId === user.id || followingUserId === user.id) {
      actions.live.onStopFollow();
    } else {
      actions.live.onFollow({ liveUserId: user.id });
    }
  };

  const firstLiveUsers = orderedLiveUsers.slice(0, USER_OVERFLOW_LIMIT);
  const restLiveUsers = orderedLiveUsers.slice(USER_OVERFLOW_LIMIT);

  useEffect(() => {
    effects.analytics.track('Editor - Amount of live users', {
      amount: orderedLiveUsers.length,
    });
  }, [orderedLiveUsers.length, effects]);

  // It doesn't make sense to show a "More" button for live users if there's
  // only one in it.
  if (restLiveUsers.length === 1) {
    firstLiveUsers.push(restLiveUsers.pop());
  }

  return (
    <Stack justify="center">
      <SingletonTooltip interactive>
        {singleton => (
          <AnimatePresence>
            {firstLiveUsers.map((user, i) => (
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
                  onClick={() => followLiveUser(user)}
                  isDimmed={
                    followingUserId !== null && user.id !== followingUserId
                  }
                  showBorder={orderedLiveUsers.length > 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </SingletonTooltip>

      {restLiveUsers.length > 0 && (
        <Menu>
          <Menu.Button
            variant="secondary"
            css={css({
              position: 'relative',
              width: HEAD_SIZE,
              height: HEAD_SIZE,
              marginRight: 8,
              ':after': {
                content: " ' '",
                position: 'absolute',
                display: 'block',
                borderRadius: 2,
                top: 0,
                width: '100%',
                height: '100%',
                boxShadow: `inset 0px 0px 0px 1.5px rgba(255, 255, 255, 0.5)`,
              },
            })}
          >
            {restLiveUsers.length}
          </Menu.Button>
          <Menu.List>
            {restLiveUsers.map(restUser => (
              <Menu.Item
                key={restUser.id}
                onSelect={() => followLiveUser(restUser)}
              >
                {restUser.username}
              </Menu.Item>
            ))}
          </Menu.List>
        </Menu>
      )}
    </Stack>
  );
};
