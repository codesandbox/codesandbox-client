import React from 'react';
import {
  Stack,
  ListAction,
  Text,
  Input,
  IconButton,
  Grid,
  Column,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const RepoListItem = ({
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
  <ListAction
    onClick={onClick}
    onDoubleClick={onDoubleClick}
    onContextMenu={onContextMenu}
    {...props}
    css={css({
      paddingX: 0,
      backgroundColor: selected
        ? 'blues.600'
        : showDropStyles
        ? 'list.hoverBackground'
        : 'inherit',
      color: selected ? 'white' : 'inherit',
      ':hover, :focus, :focus-within': {
        cursor: 'default',
        backgroundColor: selected ? 'blues.600' : 'list.hoverBackground',
      },
      width: '100%',
      height: 64,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
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
            <svg
              width={32}
              height={67}
              fill="none"
              viewBox="0 0 77 67"
              {...props}
            >
              <path
                fill="#151515"
                d="M28.724 0H1.591A1.59 1.59 0 000 1.59v63.82C0 66.287.712 67 1.59 67h73.82A1.59 1.59 0 0077 65.41V9.818a1.59 1.59 0 00-1.59-1.59H38.5L29.787.406A1.59 1.59 0 0028.724 0z"
              />
              <path
                fill="#757575"
                d="M52.854 29.169c-1.431-2.513-3.372-4.503-5.823-5.97C44.579 21.734 41.903 21 39 21c-2.903 0-5.58.733-8.031 2.2-2.452 1.466-4.392 3.456-5.823 5.969C23.716 31.68 23 34.425 23 37.4c0 3.573 1.017 6.787 3.052 9.641 2.035 2.855 4.663 4.83 7.885 5.926.375.072.653.022.834-.149.18-.17.27-.384.27-.64l-.01-1.153c-.007-.727-.01-1.36-.01-1.9l-.48.084c-.305.058-.69.082-1.156.075a8.595 8.595 0 01-1.448-.15 3.197 3.197 0 01-1.396-.64 2.708 2.708 0 01-.916-1.313l-.209-.491a5.365 5.365 0 00-.656-1.09c-.299-.398-.6-.668-.906-.81l-.146-.108a1.542 1.542 0 01-.27-.256c-.084-.1-.146-.2-.188-.3-.042-.099-.007-.18.104-.245.111-.064.312-.096.604-.096l.417.064c.277.057.621.228 1.031.513.41.284.746.654 1.01 1.11.32.584.705 1.029 1.157 1.335.45.306.906.459 1.364.459a5.78 5.78 0 001.188-.107c.333-.07.645-.178.937-.32.125-.955.465-1.688 1.02-2.2a13.95 13.95 0 01-2.135-.385 8.383 8.383 0 01-1.958-.833 5.644 5.644 0 01-1.677-1.43c-.444-.57-.81-1.317-1.094-2.243-.284-.925-.427-1.993-.427-3.203 0-1.723.55-3.19 1.646-4.4-.514-1.295-.465-2.747.146-4.356.403-.128 1-.032 1.792.289.791.32 1.371.594 1.74.822.367.227.663.42.885.576a14.452 14.452 0 014-.555c1.375 0 2.708.185 4 .555l.792-.512a11.09 11.09 0 011.916-.94c.736-.284 1.299-.363 1.688-.234.625 1.608.68 3.06.166 4.356 1.098 1.21 1.646 2.677 1.646 4.4 0 1.21-.142 2.28-.427 3.213-.284.933-.652 1.68-1.103 2.242a5.857 5.857 0 01-1.688 1.42 8.403 8.403 0 01-1.959.834c-.632.17-1.343.299-2.135.384.722.64 1.083 1.652 1.083 3.033v4.505c0 .256.087.47.26.64.174.171.449.221.824.15 3.222-1.096 5.85-3.072 7.885-5.926S55 40.974 55 37.4c0-2.975-.716-5.719-2.146-8.231z"
              />
            </svg>
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
    <IconButton
      name="more"
      size={9}
      title="Repository actions"
      onClick={onContextMenu}
    />
  </ListAction>
);
