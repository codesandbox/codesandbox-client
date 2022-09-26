import React from 'react';
import { Stack, Text } from '@codesandbox/components';
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
          <svg width={32} height={32} fill="none" viewBox="0 0 32 32">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.7502 10.6654C17.7502 13.8227 15.4398 16.4404 12.4175 16.9201V27.9985C12.4175 28.5508 11.9698 28.9985 11.4175 28.9985C10.8652 28.9985 10.4175 28.5508 10.4175 27.9985V16.9203C7.39451 16.4411 5.0835 13.8231 5.0835 10.6654C5.0835 7.16756 7.91903 4.33203 11.4168 4.33203C14.9146 4.33203 17.7502 7.16756 17.7502 10.6654ZM7.0835 10.6654C7.0835 8.27213 9.0236 6.33203 11.4168 6.33203C13.8101 6.33203 15.7502 8.27213 15.7502 10.6654C15.7502 13.053 13.8192 14.9895 11.4338 14.9987L11.4175 14.9985L11.401 14.9987C9.01503 14.9901 7.0835 13.0533 7.0835 10.6654Z"
              fill="#808080"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22.4175 16.4104C19.3945 16.8896 17.0835 19.5076 17.0835 22.6654C17.0835 26.1632 19.919 28.9987 23.4168 28.9987C26.9146 28.9987 29.7502 26.1632 29.7502 22.6654C29.7502 19.5081 27.4398 16.8904 24.4175 16.4106V12.665C24.4175 11.0082 23.0743 9.66504 21.4175 9.66504H19.4175C18.8652 9.66504 18.4175 10.1128 18.4175 10.665C18.4175 11.2173 18.8652 11.665 19.4175 11.665H21.4175C21.9698 11.665 22.4175 12.1128 22.4175 12.665V16.4104ZM19.0835 22.6654C19.0835 20.2721 21.0236 18.332 23.4168 18.332C25.8101 18.332 27.7502 20.2721 27.7502 22.6654C27.7502 25.0586 25.8101 26.9987 23.4168 26.9987C21.0236 26.9987 19.0835 25.0586 19.0835 22.6654Z"
              fill="#808080"
            />
          </svg>
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
