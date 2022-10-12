import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@styled-system/css';
import {
  Icon,
  IconButton,
  SkeletonText,
  Stack,
  Text,
} from '@codesandbox/components';
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
      as={Link}
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
      to={repository.url}
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

export const RepositoryCardSkeleton: React.FC = () => (
  <Stack
    direction="vertical"
    gap={4}
    css={css({
      width: '100%',
      height: 240,
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: '4px',
      overflow: 'hidden',
    })}
  >
    <SkeletonText css={{ width: '100%', height: '100%' }} />
  </Stack>
);
