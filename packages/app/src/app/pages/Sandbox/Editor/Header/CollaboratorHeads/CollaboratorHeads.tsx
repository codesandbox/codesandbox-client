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
  showBorder?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  singleton: TippyProps['singleton'];
}

const HEAD_SIZE = 26;

const CollaboratorHead = (props: ICollaboratorHeadProps) => {
  return (
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
          <Text>{props.username}</Text>
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
          borderRadius: '50%',
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
            borderRadius: '50%',
            top: 0,
            width: '100%',
            height: '100%',
            boxShadow: `inset 0px 0px 0px 1px rgb(${props.color.join(',')})`,
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
              borderRadius: '50%',
            },
          })}
        />
      </button>
    </Tooltip>
  );
};

export const CollaboratorHeads = () => {
  const { state } = useOvermind();
  const liveUsers = state.live.roomInfo.users;

  return (
    <Stack justify="center">
      <SingletonTooltip>
        {singleton => (
          <AnimatePresence>
            {liveUsers.map((user, i) => (
              <motion.div
                positionTransition
                style={{
                  marginLeft: -8,
                  zIndex: 10 + liveUsers.length - i,
                  display: 'flex',
                  alignItems: 'center',
                }}
                exit={{ marginLeft: 0, width: 0 }}
                key={user.id}
              >
                <CollaboratorHead
                  avatarUrl={user.avatarUrl}
                  username={user.username}
                  color={user.color}
                  id={user.id}
                  singleton={singleton}
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
