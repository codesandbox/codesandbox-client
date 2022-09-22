import React from 'react';
import {
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { BranchDetails } from './types';

export const BranchCard: React.FC<BranchDetails> = ({
  onClick,
  branchName,
  repository,
}) => {
  const ariaLabel = `Open branch ${branchName} from ${repository.name} by ${repository.owner} in the editor`;

  return (
    <Stack
      aria-label={ariaLabel}
      css={css({
        cursor: 'pointer', // TODO: revisit cursor.
        position: 'relative',
        overflow: 'hidden',
        height: 240,
        width: '100%',
        borderRadius: '4px',
        background: '#191919',
        opacity: 0.8,
        transition: 'opacity ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        ':hover, :focus, :focus-within': {
          // This is not the official transition.
          opacity: 1,
        },
        ':focus-visible': {
          boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.4)',
        },
      })}
      direction="vertical"
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick(e)}
      tabIndex={0}
      // TODO: refine semantics when/if the context menu gets implemented.
      role="link"
    >
      <Stack
        css={css({
          backgroundColor: 'rgba(229, 229, 229, 0.04)',
          paddingY: 10,
        })}
        align="center"
        justify="center"
      >
        <Icon aria-hidden color="#808080" name="branch" size={40} />
      </Stack>
      <Stack
        css={css({
          backgroundColor: 'grays.700',
          padding: 6,
        })}
        direction="vertical"
        gap={10}
      >
        <Stack align="center" justify="space-between">
          <Tooltip label={branchName}>
            <Text
              css={css({
                color: '#E5E5E5',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              })}
              weight="medium"
              size={13}
            >
              {branchName}
            </Text>
          </Tooltip>
          <IconButton
            name="more"
            size={9}
            title="Branch actions"
            onClick={() => ({})}
          />
        </Stack>
        <Stack gap={2}>
          <Icon color="#EDFFA5" name="contribution" size={16} />
          <Text
            css={css({
              color: '#808080',
            })}
            size={13}
          >
            {repository.owner}/{repository.name}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
