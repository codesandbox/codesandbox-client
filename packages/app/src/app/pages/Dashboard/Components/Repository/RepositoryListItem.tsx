import React from 'react';
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
import { css } from '@styled-system/css';
import { RepositoryProps } from './types';

export const RepositoryListItem: React.FC<RepositoryProps> = ({
  labels,
  repository,
  onContextMenu,
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
        backgroundColor: 'transparent',
        color: 'inherit',
        ':hover, :focus, :focus-within': {
          backgroundColor: 'list.hoverBackground',
        },
      })}
    >
      <Element
        aria-label={labels.repository}
        as="a"
        css={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          textDecoration: 'none',
        }}
        href={repository.url}
        onContextMenu={onContextMenu}
        {...props}
      >
        <Grid css={{ width: 'calc(100% - 26px - 8px)' }}>
          <Column
            span={[12, 5, 5]}
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
                <Text size={3} weight="medium" maxWidth="100%">
                  {repository.owner}/{repository.name}
                </Text>
              </Element>
            </Stack>
          </Column>
          <Column span={[0, 4, 4]} as={Stack} align="center">
            <Text size={3} variant="muted" maxWidth="100%">
              {labels.branches}
            </Text>
          </Column>
        </Grid>
        <IconButton
          name="more"
          size={9}
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
