import React from 'react';
import { Icon, Stack, ListAction, Text, Grid, Column } from '@codesandbox/components';
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
        backgroundColor: selected ? 'blues.600' : 'inherit',
        color: selected ? 'white' : 'inherit',
        width: '100%',
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: selected ? 'blues.600' : 'list.hoverBackground',
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
              <Icon name="git" size={16} width={32} title="repository" color="#999"/>
            </Stack>
            <Stack justify="space-between" align="center">
              <Text size={3} weight="medium">
                {name}
                {props.branch !== 'master' ? `:${props.branch}` : ''}
              </Text>
            </Stack>
          </Stack>
        </Column>
        <Column span={[0, 4, 4]} as={Stack} align="center">
          <Text size={3} weight="medium" variant="muted">
            {props.owner}
          </Text>
        </Column>
        <Column span={[0, 3, 3]} as={Stack} align="center">
          {/* empty column to align with sandbox list items */}
        </Column>
      </Grid>
    </ListAction>
  );
};
