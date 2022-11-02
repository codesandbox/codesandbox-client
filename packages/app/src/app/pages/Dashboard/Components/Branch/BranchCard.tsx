import React from 'react';
import {
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
  Element,
  Badge,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { BranchProps } from './types';

export const BranchCard: React.FC<BranchProps> = ({
  branch,
  branchUrl,
  isBeingRemoved,
  selected,
  onContextMenu,
  isViewOnly,
  ...props
}) => {
  const { name: branchName, project, contribution } = branch;
  const { repository } = project;
  const ariaLabel = `Open branch ${branchName} from ${repository.name} by ${repository.owner} in the editor`;

  return (
    <Stack
      as="a"
      aria-label={ariaLabel}
      css={css({
        position: 'relative',
        overflow: 'hidden',
        height: 240,
        width: '100%',
        borderRadius: '4px',
        border: '1px solid',
        borderColor: selected ? 'focusBorder' : 'transparent',
        backgroundColor: selected ? 'card.backgroundHover' : 'card.background',
        opacity: isBeingRemoved ? 0.5 : 1,
        pointerEvents: isBeingRemoved ? 'none' : 'all',
        transition: 'background ease-in-out, opacity ease-in-out',
        transitionDuration: theme => theme.speeds[2],
        textDecoration: 'none',
        outline: 'none',
        ':hover': {
          backgroundColor: 'card.backgroundHover',
        },
        ':has(button:hover)': {
          backgroundColor: 'card.background',
        },
        ':focus-visible': {
          borderColor: 'focusBorder',
        },
      })}
      direction="vertical"
      href={isBeingRemoved ? undefined : branchUrl}
      onContextMenu={onContextMenu}
      {...props}
    >
      <Stack
        css={css({
          backgroundColor: isViewOnly ? '#252525' : '#161616',
          paddingY: 11,
          position: 'relative',
        })}
        align="center"
        justify="center"
      >
        <Icon color="#808080" name="branch" size={32} />
      </Stack>
      {isViewOnly ? (
        <Element css={{ position: 'absolute', top: 8, left: 8 }}>
          <Badge color="accent" isPadded>
            View only
          </Badge>
        </Element>
      ) : null}
      <Stack
        css={css({
          paddingY: 5,
          paddingLeft: 5,
          paddingRight: 2,
          justifyContent: 'space-between',
          height: '100%',
        })}
        direction="vertical"
      >
        <Stack align="center" justify="space-between">
          <Tooltip label={branchName}>
            <Text
              css={css({
                color: isViewOnly ? '#999999' : '#E5E5E5',
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
            variant="square"
            name="more"
            size={14}
            title="Branch actions"
            onClick={evt => {
              evt.stopPropagation();
              onContextMenu(evt);
            }}
          />
        </Stack>
        <Stack gap={2}>
          {contribution && (
            <Icon color="#EDFFA5" name="contribution" size={16} />
          )}
          <Text
            css={css({
              color: '#808080',
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
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
