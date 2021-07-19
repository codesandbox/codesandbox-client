import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { noop } from 'overmind';
import { CardIcon } from '../Repo/Icons';

const getFullGitHubUrl = (owner: string, repo: string, branch: string) =>
  `https://beta.codesandbox.stream/github/${owner}/${repo}/${branch}`;

export const RepoBetaCard = ({
  sandbox,
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

  const { owner, repo, branch } = sandbox.gitv2;

  return (
    <Stack
      direction="vertical"
      gap={2}
      onClick={onClick}
      onDoubleClick={() => {
        window.location.href = getFullGitHubUrl(owner, repo, branch);
      }}
      onContextMenu={noop}
      {...props}
      css={css({
        width: '100%',
        height: 240,
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderRadius: 'medium',
        overflow: 'hidden',
        borderColor: selected ? 'blues.600' : 'grays.500',
        ':hover, :focus, :focus-within': {
          boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
        },
      })}
    >
      <Stack
        as="div"
        justify="center"
        align="center"
        css={css({
          height: 160,
          borderStyle: 'solid',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: 'grays.500',
          backgroundColor: 'grays.600',
        })}
      >
        <CardIcon />
      </Stack>
      <Stack justify="space-between" align="flex-start" marginLeft={4}>
        <Stack
          direction="vertical"
          gap={2}
          css={css({
            wordBreak: 'break-all',
          })}
        >
          <Text
            size={3}
            weight="medium"
            css={css({
              height: 32,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              '-webkit-line-clamp': '2',
              '-webkit-box-orient': 'vertical',
            })}
          >
            {owner}/{repo}
          </Text>
          <Text size={3} variant="muted" weight="medium">
            {branch}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
