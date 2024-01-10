import React from 'react';
import {
  Grid,
  Column,
  Stack,
  Text,
  IconButton,
  Avatar,
  Tooltip,
  ListAction,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { AnonymousAvatar } from './AnonymousAvatar';
import { CommunitySandboxItemComponentProps } from './types';

export const SandboxListItem = ({
  title,
  TemplateIcon,
  screenshotUrl,
  likeCount,
  forkCount,
  author,
  // interactions
  isScrolling,
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  ...props
}: CommunitySandboxItemComponentProps) => {
  const [stoppedScrolling, setStoppedScrolling] = React.useState(false);
  React.useEffect(() => {
    // We only want to render the screenshot once the user has stopped scrolling
    if (!isScrolling && !stoppedScrolling) {
      setStoppedScrolling(true);
    }
  }, [isScrolling, stoppedScrolling]);

  return (
    <ListAction
      align="center"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      {...props}
      css={css({
        paddingX: 0,
        height: 64,
        borderBottom: '1px solid',
        borderBottomColor: 'grays.600',
        overflow: 'hidden',
        backgroundColor: selected ? 'blues.600' : 'transparent',
        color: selected ? 'white' : 'inherit',
        ':hover, :focus, :focus-within': {
          cursor: 'default',
          backgroundColor: selected ? 'blues.600' : 'list.hoverBackground',
        },
      })}
    >
      <Grid css={{ width: 'calc(100% - 26px - 8px)' }} columnGap={2}>
        <Column
          span={[12, 7, 7]}
          css={{
            display: 'block',
            overflow: 'hidden',
            paddingBottom: 4,
            paddingTop: 4,
          }}
        >
          <Stack gap={4} align="center" marginLeft={2}>
            <Stack
              as="div"
              justify="center"
              align="center"
              css={css({
                borderRadius: 'small',
                height: 32,
                width: 32,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                border: '1px solid',
                borderColor: 'grays.500',
                backgroundColor: 'grays.700',
                flexShrink: 0,
                position: 'relative',
                svg: {
                  filter: 'grayscale(1)',
                  opacity: 0.1,
                },
              })}
              style={{
                [screenshotUrl
                  ? 'backgroundImage'
                  : null]: `url(${screenshotUrl})`,
              }}
            >
              {screenshotUrl ? null : <TemplateIcon width="16" height="16" />}
            </Stack>

            <Tooltip label={title}>
              <Stack gap={1} align="center" css={{ overflow: 'hidden' }}>
                <Text size={3} weight="medium" maxWidth="100%">
                  {title}
                </Text>
              </Stack>
            </Tooltip>
          </Stack>
        </Column>
        <Column span={[0, 2, 2]} as={Stack} align="center">
          <Stack
            align="center"
            gap={2}
            css={{ flexShrink: 1, overflow: 'hidden' }}
          >
            {author.username ? (
              <Avatar css={css({ size: 6, borderRadius: 2 })} user={author} />
            ) : (
              <AnonymousAvatar />
            )}
            <Text size={3} maxWidth="100%">
              {author.username || 'Anonymous'}
            </Text>
          </Stack>
        </Column>
      </Grid>
      <IconButton
        name="more"
        size={9}
        title="Sandbox actions"
        onClick={onContextMenu}
      />
    </ListAction>
  );
};
