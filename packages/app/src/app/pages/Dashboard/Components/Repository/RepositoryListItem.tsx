import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@styled-system/css';
import {
  Element,
  Column,
  Grid,
  Icon,
  IconButton,
  ListAction,
  Stack,
  Text,
} from '@codesandbox/components';
import { RepositoryProps } from './types';

export const RepositoryListItem: React.FC<RepositoryProps> = ({
  labels,
  repository,
  selected,
  onContextMenu,
  isBeingRemoved,
  ...props
}) => {
  return (
    <ListAction
      align="center"
      css={css({
        paddingX: 0,
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        overflow: 'hidden',
        backgroundColor:
          selected && !isBeingRemoved ? 'purpleOpaque' : 'transparent',
        color: selected && !isBeingRemoved ? 'white' : 'inherit',
        transition: 'background ease-in-out, opacity ease-in-out',
        opacity: isBeingRemoved ? 0.5 : 1,
        pointerEvents: isBeingRemoved ? 'none' : 'all',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor:
            selected && !isBeingRemoved
              ? 'purpleOpaque'
              : 'list.hoverBackground',
        },
        ':has(button:hover)': {
          backgroundColor: 'transparent',
        },
      })}
    >
      <Element
        aria-label={labels.repository}
        as={Link}
        css={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          textDecoration: 'none',
        }}
        to={isBeingRemoved ? undefined : repository.url}
        onContextMenu={onContextMenu}
        {...props}
      >
        <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={4}>
          <Column span={[12, 8, 8]}>
            <Stack gap={3} align="center" marginLeft={2}>
              <Text
                css={{
                  fontSize: '14px',
                  color: '#E5E5E5',
                }}
              >
                {repository.name}
              </Text>
              <Text size={2} color="#999">
                {repository.owner}
              </Text>
            </Stack>
          </Column>
          <Column span={[0, 4, 4]} as={Stack} align="center">
            <Stack
              justify="flex-end"
              align="center"
              gap={2}
              css={{ paddingRight: '16px' }}
            >
              {repository.private ? (
                <Icon color="#808080" name="lock" size={12} />
              ) : null}
              <Stack gap={1}>
                <Icon color="#999" name="branch" size={12} />
                <Text size={3} variant="muted" maxWidth="100%">
                  {labels.branches}
                </Text>
              </Stack>
            </Stack>
          </Column>
        </Grid>
        <IconButton
          variant="square"
          name="more"
          size={14}
          title="Repository actions"
          onClick={evt => {
            evt.stopPropagation();
            onContextMenu(evt);
          }}
        />
      </Element>
    </ListAction>
  );
};
