import React, { useState } from 'react';
import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import { zonedTimeToUtc } from 'date-fns-tz';
import css from '@styled-system/css';
import { Stack, Element, Text, ListAction } from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useActions } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import { CommentIcon } from './Icons';
import { Menu } from './Menu';

interface Props {
  insertedAt: string;
  id: string;
  read: boolean;
  userId: string;
  sandboxId: string;
  commenterUsername: string;
  commenterAvatarUrl: string;
  sandboxName: string;
}

export const Comment = ({
  id,
  insertedAt,
  commenterAvatarUrl,
  commenterUsername,
  read,
  sandboxId,
  sandboxName,
  userId,
}: Props) => {
  const { updateReadStatus } = useActions().userNotifications;

  const history = useHistory();

  const [hover, setHover] = useState(false);
  return (
    <ListAction
      key={id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={async () => {
        await updateReadStatus(id);

        history.push(sandboxUrl({ id: sandboxId }));
      }}
      css={css({ padding: 0 })}
    >
      <Element
        css={css({
          opacity: read ? 0.4 : 1,
        })}
      >
        <Stack align="center" gap={2} padding={4}>
          <Stack gap={4} align="flex-start">
            <Element css={css({ position: 'relative' })}>
              <Element
                as="img"
                src={commenterAvatarUrl}
                alt={commenterUsername}
                css={css({
                  width: 32,
                  height: 32,
                  display: 'block',
                  borderRadius: 'small',
                })}
              />
              <CommentIcon
                read={read}
                css={css({
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                })}
              />
            </Element>

            <Text size={3} variant="muted">
              {commenterUsername}{' '}
              <Text css={css({ color: 'sideBar.foreground' })}>commented</Text>{' '}
              on {sandboxName}
            </Text>
          </Stack>
          <Stack
            css={css({
              width: 70,
              flexShrink: 0,
              justifyContent: 'flex-end',
            })}
          >
            {hover ? (
              <Menu read={read} id={id} />
            ) : (
              <Text
                size={2}
                align="right"
                block
                css={css({ color: 'sideBar.foreground' })}
              >
                {shortDistance(
                  formatDistanceStrict(
                    zonedTimeToUtc(insertedAt, 'Etc/UTC'),
                    new Date()
                  )
                )}
              </Text>
            )}
          </Stack>
        </Stack>
      </Element>
    </ListAction>
  );
};
