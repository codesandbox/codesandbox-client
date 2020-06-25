import React from 'react';
import { Stack, Text, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';

export const RepoCard = ({
  name,
  path,
  // interactions
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  isNewFolder,
  // drop target
  showDropStyles,
  // drag preview
  thumbnailRef,
  opacity,
  ...props
}) => (
  <Stack
    direction="vertical"
    gap={2}
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      width: '100%',
      height: 240,
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderRadius: 'medium',
      overflow: 'hidden',
      // drop ssarget
      borderColor: getBorderColor(selected, showDropStyles),
      boxShadow: theme =>
        showDropStyles ? '0 4px 16px 0 ' + theme.colors.grays[900] : null,

      // drag state,
      opacity,

      ':hover, :focus, :focus-within': {
        boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
      },
    })}
  >
    <Stack
      as="div"
      justify="center"
      align="center"
      ref={thumbnailRef}
      css={css({
        height: 160,
        borderStyle: 'solid',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: 'grays.500',
        backgroundColor: 'grays.600',
      })}
    >
      {' '}
      <svg width={77} height={67} fill="none">
        <path
          d="M28.724 0H1.591A1.59 1.59 0 000 1.59v63.82C0 66.287.712 67 1.59 67h73.82A1.59 1.59 0 0077 65.41V9.818a1.59 1.59 0 00-1.59-1.59H38.5L29.787.406A1.59 1.59 0 0028.724 0z"
          fill="#6CC7F6"
        />
        <path
          d="M52.854 29.169c-1.431-2.513-3.372-4.503-5.823-5.97C44.579 21.734 41.903 21 39 21c-2.903 0-5.58.733-8.031 2.2-2.452 1.466-4.392 3.456-5.823 5.969C23.716 31.68 23 34.425 23 37.4c0 3.573 1.017 6.787 3.052 9.641 2.035 2.855 4.663 4.83 7.885 5.926.375.072.653.022.834-.149.18-.17.27-.384.27-.64l-.01-1.153c-.007-.727-.01-1.36-.01-1.9l-.48.084c-.305.058-.69.082-1.156.075a8.595 8.595 0 01-1.448-.15 3.197 3.197 0 01-1.396-.64 2.708 2.708 0 01-.916-1.313l-.209-.491a5.365 5.365 0 00-.656-1.09c-.299-.398-.6-.668-.906-.81l-.146-.108a1.542 1.542 0 01-.27-.256c-.084-.1-.146-.2-.188-.3-.042-.099-.007-.18.104-.245.111-.064.312-.096.604-.096l.417.064c.277.057.621.228 1.031.513.41.284.746.654 1.01 1.11.32.584.705 1.029 1.157 1.335.45.306.906.459 1.364.459a5.78 5.78 0 001.188-.107c.333-.07.645-.178.937-.32.125-.955.465-1.688 1.02-2.2a13.95 13.95 0 01-2.135-.385 8.383 8.383 0 01-1.958-.833 5.644 5.644 0 01-1.677-1.43c-.444-.57-.81-1.317-1.094-2.243-.284-.925-.427-1.993-.427-3.203 0-1.723.55-3.19 1.646-4.4-.514-1.295-.465-2.747.146-4.356.403-.128 1-.032 1.792.289.791.32 1.371.594 1.74.822.367.227.663.42.885.576a14.452 14.452 0 014-.555c1.375 0 2.708.185 4 .555l.792-.512a11.09 11.09 0 011.916-.94c.736-.284 1.299-.363 1.688-.234.625 1.608.68 3.06.166 4.356 1.098 1.21 1.646 2.677 1.646 4.4 0 1.21-.142 2.28-.427 3.213-.284.933-.652 1.68-1.103 2.242a5.857 5.857 0 01-1.688 1.42 8.403 8.403 0 01-1.959.834c-.632.17-1.343.299-2.135.384.722.64 1.083 1.652 1.083 3.033v4.505c0 .256.087.47.26.64.174.171.449.221.824.15 3.222-1.096 5.85-3.072 7.885-5.926S55 40.974 55 37.4c0-2.975-.716-5.719-2.146-8.231z"
          fill="#000"
          fillOpacity={0.4}
        />
      </svg>
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
          title={`${props.owner}/${name}/tree/${props.branch}`}
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
          {props.owner}/{name}
        </Text>
        <Text size={3} variant="muted" weight="medium">
          {props.branch}
        </Text>
      </Stack>
      <IconButton
        name="more"
        size={9}
        title="Repo actions"
        onClick={onContextMenu}
      />
    </Stack>
  </Stack>
);

const getBorderColor = (selected, showDropStyles) => {
  if (selected) return 'blues.600';
  if (showDropStyles) return 'grays.400';
  return 'grays.500';
};
