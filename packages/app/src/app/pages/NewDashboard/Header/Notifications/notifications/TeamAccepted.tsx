import React from 'react';

import css from '@styled-system/css';
import { Stack, Element, Text, ListAction } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

interface Props {
  id: string;
  read: boolean;
  teamName: string;
  userName: string;
  userAvatar: string;
}

const Icon = ({ read, ...props }) => (
  <Stack
    align="center"
    justify="center"
    css={css({
      borderRadius: '50%',
      width: 18,
      height: 18,
      background:
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%), #5BC266;',
    })}
    {...props}
  >
    <svg width={9} height={9} fill="none" viewBox="0 0 9 9">
      <path
        fill={read ? '#C4C4C4' : '#fff'}
        fillRule="evenodd"
        d="M4.425 1.79c0 .393-.14.78-.304 1.075-.038.067.03.18.097.293.074.125.149.25.085.314-.176.175-.59.154-.927.13-.22.192-.486.305-.772.305-.322 0-.618-.143-.853-.382l-.192.09C1.06 3.55.752 2.728.871 1.781.99.834 1.49.12 1.99.186c.114.024.217.056.311.094.215-.177.47-.28.742-.28.763 0 1.382.802 1.382 1.79zM.021 7.068h3.782A2.648 2.648 0 104.078 5c-.37-.229-.884-.386-1.593-.402C-.4 4.534.02 7.067.02 7.067zm7.867-1.02H6.63V4.73h-.577v1.318h-1.26v.543h1.26v1.427h.577V6.59h1.26v-.543z"
        clipRule="evenodd"
      />
    </svg>
  </Stack>
);

export const TeamAccepted = ({
  id,
  read,
  teamName,
  userName,
  userAvatar,
}: Props) => {
  const {
    actions: {
      userNotifications: { markNotificationAsRead },
    },
  } = useOvermind();
  return (
    <ListAction
      key={teamName}
      onClick={() => markNotificationAsRead(id)}
      css={css({ padding: 0 })}
    >
      <Element
        css={css({
          opacity: read ? 0.4 : 1,
        })}
      >
        <Stack align="center" gap={4} padding={4}>
          <Element css={css({ position: 'relative' })}>
            <Element
              as="img"
              src={userAvatar}
              alt={userName}
              css={css({ width: 32, height: 32, display: 'block' })}
            />
            <Icon
              read={read}
              css={css({ position: 'absolute', bottom: '-4px', right: '-4px' })}
            />
          </Element>

          <Text size={3} variant="muted">
            {userName} <Text css={css({ color: 'white' })}>accepted</Text> your
            invitation to join {teamName}!
          </Text>
        </Stack>
      </Element>
    </ListAction>
  );
};
