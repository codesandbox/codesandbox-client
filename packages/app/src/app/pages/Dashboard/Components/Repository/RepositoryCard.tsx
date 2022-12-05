import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@styled-system/css';
import { Icon, IconButton, Stack, Text, Badge } from '@codesandbox/components';
import { RepositoryProps } from './types';

export const RepositoryCard: React.FC<RepositoryProps> = ({
  labels,
  repository,
  selected,
  onContextMenu,
  isBeingRemoved,
  isViewOnly,
  ...props
}) => {
  return (
    <Stack
      as={Link}
      aria-label={labels.repository}
      css={css({
        cursor: 'pointer',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        padding: '24px',
        borderRadius: '4px',
        border: '1px solid',
        borderColor: selected ? 'focusBorder' : 'transparent',
        backgroundColor: selected ? 'card.backgroundHover' : 'card.background',
        outline: 'none',
        opacity: isBeingRemoved ? 0.5 : 1,
        pointerEvents: isBeingRemoved ? 'none' : 'all',
        transition: 'background ease-in-out, opacity ease-in-out',
        transitionDuration: theme => theme.speeds[2],
        textDecoration: 'none',
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':has(button:hover)': {
          backgroundColor: 'card.background',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
      direction="vertical"
      to={isBeingRemoved ? undefined : repository.url}
      onContextMenu={onContextMenu}
      {...props}
    >
      <Stack
        direction="vertical"
        justify="space-between"
        css={{ height: '100%' }}
      >
        <Stack direction="vertical" gap={1}>
          <Stack
            justify="space-between"
            align="center"
            css={{ height: '16px' }}
          >
            <Text color="#999" size={12}>
              {repository.owner}
            </Text>
            <IconButton
              variant="square"
              name="more"
              size={12}
              title="Repository actions"
              onClick={evt => {
                evt.stopPropagation();
                onContextMenu(evt);
              }}
            />
          </Stack>
          <Text color={isViewOnly ? '#999' : '#e5e5e5'} size={13} weight="500">
            {repository.name}
          </Text>
        </Stack>

        <Stack justify="space-between" gap={4}>
          <Stack align="center" gap={2}>
            {repository.private ? (
              <Icon color="#999" name="lock" size={12} />
            ) : null}
            <Stack align="center" gap={1}>
              <Icon color="#999" name="branch" />
              <Text color="#999" size={12}>
                {labels.branches}
              </Text>
            </Stack>
          </Stack>

          {isViewOnly ? <Badge variant="trial">Restricted</Badge> : null}
        </Stack>
      </Stack>
    </Stack>
  );
};
