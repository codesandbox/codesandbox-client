import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@styled-system/css';
import {
  Icon,
  IconButton,
  Stack,
  Text,
  Element,
  Badge,
} from '@codesandbox/components';
import { RepositoryProps } from './types';

export const RepositoryCard: React.FC<RepositoryProps> = ({
  labels,
  repository,
  selected,
  onContextMenu,
  isBeingRemoved,
  restricted,
  ...props
}) => {
  return (
    <Stack
      as={Link}
      aria-label={labels.repository}
      css={css({
        cursor: 'pointer', // TODO: revisit cursor.
        position: 'relative',
        overflow: 'hidden',
        height: 240,
        width: '100%',
        padding: 4,
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
      gap={4}
      to={isBeingRemoved ? undefined : repository.url}
      onContextMenu={onContextMenu}
      {...props}
    >
      {restricted ? (
        <Element css={{ position: 'absolute', top: 20, left: 20 }}>
          <Badge variant="trial">Restricted</Badge>
        </Element>
      ) : null}
      <IconButton
        css={css({
          marginLeft: 'auto',
          marginRight: 0,
        })}
        variant="square"
        name="more"
        size={14}
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
              color: restricted ? '#999999' : '#E5E5E5',
              textAlign: 'center',
              minHeight: 42,
              paddingX: 6,
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
