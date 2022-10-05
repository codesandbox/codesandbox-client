import React from 'react';
import { Stack, Text, Element, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
import { v2DraftBranchUrl } from '@codesandbox/common/lib/utils/url-generator';

export const NewBranchCard: React.FC<{ owner: string; repoName: string }> = ({
  owner,
  repoName,
}) => {
  return (
    <Element
      as="a"
      href={v2DraftBranchUrl(owner, repoName)}
      css={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        fontSize: 3,
        fontWeight: 'normal',
        color: '#e5e5e5',
        height: 240,
        outline: 'none',
        backgroundColor: 'card.background',
        border: '1px solid',
        borderColor: 'transparent',
        borderRadius: 'medium',
        transition: 'background ease-in',
        transitionDuration: theme => theme.speeds[2],
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
    >
      <Stack direction="vertical" align="center" gap={4}>
        <Icon name="plus" size={32} />
        <Text>Create branch</Text>
      </Stack>
    </Element>
  );
};
