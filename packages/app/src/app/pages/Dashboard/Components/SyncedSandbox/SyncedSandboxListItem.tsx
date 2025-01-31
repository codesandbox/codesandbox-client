import React from 'react';
import {
  Element,
  Icon,
  Stack,
  ListAction,
  Text,
  Grid,
  Column,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Link } from 'react-router-dom';

export const SyncedSandboxListItem = ({ name, path, url, ...props }) => {
  return (
    <ListAction
      css={css({
        paddingX: 0,
        backgroundColor: 'inherit',
        color: 'inherit',
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: 'list.hoverBackground',
        },
      })}
    >
      <Element
        as={Link}
        css={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          textDecoration: 'none',
        }}
        to={url}
      >
        <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={4}>
          <Column span={[10, 5, 4]}>
            <Stack gap={4} align="center" marginLeft={2}>
              <Stack
                as="div"
                justify="center"
                align="center"
                css={css({
                  height: 32,
                })}
              >
                <Icon
                  name="github"
                  size={16}
                  width={32}
                  title="Synced sandbox"
                  color="#999"
                />
              </Stack>
              <Stack justify="space-between" align="center">
                <Text size={3} weight="medium" css={{ color: '#E5E5E5' }}>
                  {name}
                  {['main', 'master'].includes(props.branch)
                    ? ''
                    : `:${props.branch}`}
                </Text>
              </Stack>
            </Stack>
          </Column>
          <Column span={[0, 2, 2]} />
          <Column span={[0, 5, 2]} as={Stack} align="center" />
          <Column span={[0, 3, 3]} as={Stack} align="center">
            {/* empty column to align with sandbox list items */}
          </Column>
        </Grid>
      </Element>
    </ListAction>
  );
};
