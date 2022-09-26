import React from 'react';
import { Stack, Text, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import { noop } from 'overmind';

export const RepoCard = ({
  name,
  path,
  // interactions
  selected,
  isScrolling,
  onClick,
  onDoubleClick,
  onContextMenu,
  ...props
}) => {
  const [stoppedScrolling, setStoppedScrolling] = React.useState(false);

  React.useEffect(() => {
    if (!isScrolling && !stoppedScrolling) {
      setStoppedScrolling(true);
    }
  }, [isScrolling, stoppedScrolling]);

  return (
    <Stack
      direction="vertical"
      gap={2}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={noop}
      {...props}
      css={css({
        width: '100%',
        height: 240,
        backgroundColor: selected ? 'card.backgroundHover' : 'card.background',
        border: '1px solid',
        borderRadius: 'medium',
        overflow: 'hidden',
        transition: 'background ease-in',
        transitionDuration: theme => theme.speeds[2],
        borderColor: selected ? 'focusBorder' : 'transparent',
        '&:hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
    >
      <Stack
        as="div"
        justify="center"
        align="center"
        direction="vertical"
        gap={1}
        paddingX={5}
        css={{ flexGrow: 1, textAlign: 'center', wordBreak: 'break-all' }}
      >
        <Stack paddingBottom={4} aria-hidden="true" css={{ minHeight: 40 }}>
          <Icon name="git" size={24} title="repository" color="#999"/>
        </Stack>

        <Text
          title={`${props.owner}/${name}/tree/${props.branch}`}
          size={4}
          css={{
            minHeight: 42,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
          }}
        >
          {props.owner}/{name}
        </Text>
        <Stack>
          <Text size={3} variant="muted">
            {/* TODO: Show the number of branches */}
            {props.branch}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
