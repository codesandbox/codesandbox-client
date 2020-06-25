import React from 'react';
import {
  Stack,
  ListAction,
  Text,
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
            <svg width={30} height={27} fill="none">
              <path
                d="M11.242 0H.475A.475.475 0 000 .475v26.05c0 .262.213.475.475.475h29.05a.475.475 0 00.475-.475V3.791a.475.475 0 00-.475-.475H15L11.565.126A.475.475 0 0011.242 0z"
                fill="#6CC7F6"
              />
              <path
                d="M21.061 10.574a7.06 7.06 0 00-2.547-2.612A6.719 6.719 0 0015 7a6.72 6.72 0 00-3.514.962 7.059 7.059 0 00-2.547 2.612A7.155 7.155 0 008 14.175c0 1.564.445 2.97 1.335 4.219.89 1.248 2.04 2.113 3.45 2.592.164.031.286.01.365-.065a.37.37 0 00.118-.28l-.005-.505a86.143 86.143 0 01-.004-.831l-.21.037a2.612 2.612 0 01-.506.033 3.756 3.756 0 01-.633-.066 1.399 1.399 0 01-.61-.28 1.184 1.184 0 01-.402-.574l-.09-.215a2.347 2.347 0 00-.288-.477c-.13-.174-.263-.292-.396-.355l-.064-.047a.678.678 0 01-.119-.112.516.516 0 01-.082-.13c-.018-.044-.003-.08.046-.108.049-.028.137-.042.264-.042l.182.028c.122.025.272.1.452.224.179.125.326.287.442.486.14.255.308.45.506.584.197.134.396.2.596.2.2 0 .374-.015.52-.046.146-.031.282-.078.41-.14.055-.418.204-.738.447-.962a6.104 6.104 0 01-.935-.169 3.671 3.671 0 01-.856-.364 2.47 2.47 0 01-.734-.626c-.194-.25-.354-.576-.479-.981a4.775 4.775 0 01-.186-1.402c0-.753.24-1.395.72-1.924-.225-.567-.204-1.202.064-1.906.176-.056.437-.014.783.126.347.14.6.26.761.36.162.1.29.183.388.252a6.323 6.323 0 011.75-.243c.601 0 1.185.081 1.75.243l.346-.224c.237-.15.517-.287.839-.411.322-.125.568-.16.738-.103.274.704.298 1.339.073 1.906.48.53.72 1.17.72 1.925 0 .529-.062.998-.187 1.405-.124.409-.285.735-.482.982a2.564 2.564 0 01-.739.62c-.295.17-.58.29-.857.365a6.1 6.1 0 01-.934.169c.316.28.474.722.474 1.326v1.971c0 .113.038.206.114.28.076.075.196.097.36.066 1.41-.48 2.56-1.344 3.45-2.593.89-1.248 1.335-2.654 1.335-4.218a7.16 7.16 0 00-.939-3.601z"
                fill="#000"
                fillOpacity={0.45}
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
