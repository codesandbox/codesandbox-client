import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@styled-system/css';
import {
  Element,
  Badge,
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
  isViewOnly,
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
          <Column
            span={[10, 5, 4]}
            css={{
              display: 'block',
              overflow: 'hidden',
              paddingBottom: 4,
              paddingTop: 4,
            }}
          >
            <Stack gap={4} align="center" marginLeft={2}>
              <Icon color="#999" name="repository" size={16} width="32px" />
              <Element css={{ overflow: 'hidden' }}>
                <Text
                  size={3}
                  weight="medium"
                  maxWidth="100%"
                  css={{ color: isViewOnly ? '#999999' : '#E5E5E5' }}
                >
                  {repository.owner}/{repository.name}
                </Text>
              </Element>
            </Stack>
          </Column>
          <Column span={[0, 2, 2]}>
            {isViewOnly ? (
              <Stack align="center">
                <Badge color="accent" isPadded>
                  View only
                </Badge>
              </Stack>
            ) : null}
          </Column>
          <Column span={[0, 5, 6]} as={Stack} align="center">
            <Text size={3} variant="muted" maxWidth="100%">
              {labels.branches}
            </Text>
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
