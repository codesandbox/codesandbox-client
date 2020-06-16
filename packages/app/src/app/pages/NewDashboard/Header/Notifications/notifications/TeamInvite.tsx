import React, { FunctionComponent } from 'react';

import css from '@styled-system/css';
import { Stack, Element, Text, ListAction } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

const Icon = ({ read, ...props }) => (
  <Stack
    align="center"
    justify="center"
    css={css({
      borderRadius: '50%',
      width: 18,
      height: 18,
      background:
        'linear-gradient(225deg, rgba(0, 0, 0, 0) 13.89%, rgba(0, 0, 0, 0.2) 83.33%), #BF5AF2',
    })}
    {...props}
  >
    <svg width={12} height={8} fill="none" viewBox="0 0 12 8">
      <path
        fill={read ? '#C4C4C4' : '#fff'}
        fillRule="evenodd"
        d="M2.39 4.144c.832 0 1.508-.8 1.526-1.719a.372.372 0 00.067-.182.349.349 0 00-.076-.265c-.043-.844-.26-1.741-1.15-1.85h-.01C2.487.096 1.9.025 1.78.38.967.28.866 1.143.86 1.855c-.094.058-.142.195-.112.336a.358.358 0 00.116.2c.002.934.685 1.753 1.526 1.753zM3 7c0-.782 0-1.5 1-2C3 4 .173 3.845 0 7h3zM9.746 4.152c-.843.005-1.532-.812-1.537-1.748v-.142a.364.364 0 01-.086-.194c-.018-.129.028-.249.11-.309C8.3.991 8.548.242 9.356.14h.01c.259-.034.846-.108.969.246.897-.114.934.946.93 1.684.066.066.1.178.079.297a.37.37 0 01-.087.183c-.069.867-.717 1.599-1.512 1.603zm-.898 2.594c.018-.535.029-.871-.734-1.646C8.562 4.352 12 4 12 7.024H8.842c0-.1.003-.191.006-.278z"
        clipRule="evenodd"
      />
      <path
        fill={read ? '#C4C4C4' : '#fff'}
        fillRule="evenodd"
        d="M7.912 2.09c0 .399-.142.792-.31 1.092-.037.068.031.183.1.298.075.126.15.253.086.318-.179.179-.6.157-.941.132-.224.196-.495.31-.785.31-.327 0-.628-.144-.867-.387L5 3.944c-.507-.067-.82-.901-.699-1.864.12-.962.63-1.687 1.137-1.62.116.025.221.057.316.095.218-.18.477-.284.754-.284.775 0 1.404.815 1.404 1.82zM3.458 7.25h5.066S8.89 4.805 5.96 4.74c-2.93-.063-2.502 2.51-2.502 2.51z"
        clipRule="evenodd"
      />
    </svg>
  </Stack>
);

type Props = {
  id: string;
  read: boolean;
  teamId: string;
  teamName: string;
  inviterName: string;
  inviterAvatar: string;
};
export const TeamInvite: FunctionComponent<Props> = ({
  id,
  read,
  teamId,
  teamName,
  inviterName,
  inviterAvatar,
}) => {
  const {
    actions: { userNotifications },
  } = useOvermind();

  const onClick = async () => {
    if (read) return () => {};
    await userNotifications.openTeamAcceptModal({
      teamName,
      teamId,
      userAvatar: inviterName,
    });

    return userNotifications.markNotificationAsRead(id);
  };
  return (
    <ListAction onClick={onClick} key={teamId} css={css({ padding: 0 })}>
      <Element
        css={css({
          opacity: read ? 0.4 : 1,
        })}
      >
        <Stack align="center" gap={4} padding={4}>
          <Element css={css({ position: 'relative' })}>
            <Element
              as="img"
              src={inviterAvatar}
              alt={inviterName}
              css={css({ width: 32, height: 32, display: 'block' })}
            />
            <Icon
              read={read}
              css={css({ position: 'absolute', bottom: '-4px', right: '-4px' })}
            />
          </Element>

          <Text size={3} variant="muted">
            {inviterName} <Text css={css({ color: 'white' })}>invites</Text> you
            to join team {teamName}
          </Text>
        </Stack>
      </Element>
    </ListAction>
  );
};
