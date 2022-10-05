import React from 'react';
import { Icon, IconButton, Stack, Text } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { RepositoryProps } from './types';

export const RepositoryCard: React.FC<RepositoryProps> = ({
  labels,
  repository,
  selected,
  onContextMenu,
  ...props
}) => {
  return (
    <Stack
      as="a"
      aria-label={labels.repository}
      css={css({
        cursor: 'pointer', // TODO: revisit cursor.
        position: 'relative',
        overflow: 'hidden',
        height: 240,
        width: '100%',
        borderRadius: '4px',
        border: '1px solid',
        borderColor: selected ? 'focusBorder' : 'transparent',
        backgroundColor: selected ? 'card.backgroundHover' : 'card.background',
        transition: 'background ease-in-out',
        paddingRight: 4,
        paddingLeft: 4,
        paddingTop: 4,
        paddingBottom: 4,
        outline: 'none',
        transitionDuration: theme => theme.speeds[2],
        textDecoration: 'none',
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
      direction="vertical"
      gap={4}
      href={repository.url}
      onContextMenu={onContextMenu}
      {...props}
    >
      <IconButton
        css={css({
          marginLeft: 'auto',
          marginRight: 0,
        })}
        name="more"
        size={9}
        title="Repository actions"
        onClick={evt => {
          evt.stopPropagation();
          onContextMenu(evt);
        }}
      />

      <Stack align="center" direction="vertical" gap={6}>
        <Icon color="#999" name="repository" size={24} />{' '}
        <Stack align="center" direction="vertical" gap={2}>
          <Text
            css={css({
              color: '#E5E5E5',
              textAlign: 'center',
              minHeight: 42,
              paddingLeft: 4,
              paddingRight: 4,
            })}
            size={16}
          >
            {repository.owner}/{repository.name}
          </Text>
          <Text
            css={css({
              color: '#808080',
              textAlign: 'center',
            })}
            size={13}
          >
            {labels.branches}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
