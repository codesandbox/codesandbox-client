import React from 'react';
import {
  Icon,
  Stack,
  ListAction,
  Text,
  Grid,
  Column,
} from '@codesandbox/components';
import { noop } from 'overmind';
import css from '@styled-system/css';

export const RepoListItem = ({
  name,
  path,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  isScrolling,
  ...props
}) => {
  const [stoppedScrolling, setStoppedScrolling] = React.useState(false);

  React.useEffect(() => {
    if (!isScrolling && !stoppedScrolling) {
      setStoppedScrolling(true);
    }
  }, [isScrolling, stoppedScrolling]);

  return (
    <ListAction
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={noop}
      {...props}
      css={css({
        paddingX: 0,
        backgroundColor: selected ? 'purpleOpaque' : 'inherit',
        color: selected ? 'white' : 'inherit',
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: selected ? 'purpleOpaque' : 'list.hoverBackground',
        },
      })}
    >
      <Grid css={{ width: 'calc(100% - 26px - 8px)' }}>
        <Column span={[12, 5, 5]}>
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
              <Text size={3} weight="medium">
                {name}
                {props.branch !== 'master' ? `:${props.branch}` : ''}
              </Text>
            </Stack>
          </Stack>
        </Column>
        <Column span={[0, 6, 1]} as={Stack} align="center">
          <Text
            size={3}
            paddingX={4}
            paddingY={2}
            css={{
              color: '#C2C2C2',
              backgroundColor: '#1D1D1D',
              borderRadius: 99,
              ':hover, :focus, :focus-within': {
                backgroundColor: '#303030',
              },
            }}
          >
            Synced
          </Text>
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
      </Grid>
    </ListAction>
  );
};
