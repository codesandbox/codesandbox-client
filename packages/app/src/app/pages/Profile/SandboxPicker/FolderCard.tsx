import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import designLanguage from '@codesandbox/components/lib/design-language/theme';
import { ProfileCollectionType } from '../constants';

export const FolderCard: React.FC<{
  collection: ProfileCollectionType;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ collection, onClick, ...props }) => (
  <Stack
    direction="vertical"
    gap={2}
    css={css({
      width: '100%',
      height: 240,
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderRadius: 'medium',
      overflow: 'hidden',
      borderColor: 'grays.500',
      transition: 'box-shadow ease-in-out',

      transitionDuration: (theme: typeof designLanguage) => theme.speeds[4],
      ':hover, :focus, :focus-within': {
        boxShadow: (theme: typeof designLanguage) =>
          '0 4px 16px 0 ' + theme.colors.grays[900],
      },
    })}
    onClick={onClick}
    {...props}
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
        cursor: 'pointer',
      })}
    >
      <svg width={56} height={49} fill="none" viewBox="0 0 56 49">
        <path
          fill="#6CC7F6"
          d="M20.721 0H1.591A1.59 1.59 0 000 1.59v45.82C0 48.287.712 49 1.59 49h52.82A1.59 1.59 0 0056 47.41V7.607a1.59 1.59 0 00-1.59-1.59H28L21.788.41A1.59 1.59 0 0020.72 0z"
        />
      </svg>
    </Stack>
    <Stack
      justify="space-between"
      align="center"
      marginLeft={4}
      css={{ minHeight: 26 }}
    >
      <Text size={3} weight="medium">
        {collection.path.split('/').pop()}
      </Text>
    </Stack>
  </Stack>
);
