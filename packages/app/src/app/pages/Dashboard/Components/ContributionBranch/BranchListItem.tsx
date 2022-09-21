import React from 'react';
import {
  Grid,
  Column,
  Stack,
  Element,
  Text,
  ListAction,
  IconButton,
  SkeletonText,
  Tooltip,
} from '@codesandbox/components';
import css from '@styled-system/css';

export const BranchListItem = ({
  branchName,
  branchLocation,
  BranchIcon,
  onClick,
}: {
  branchName: string;
  branchLocation: string;
  BranchIcon: JSX.Element;
  onClick: (e: React.MouseEvent | React.KeyboardEvent) => void;
}) => (
  <ListAction
    align="center"
    onClick={onClick}
    css={css({
      paddingX: 0,
      height: 64,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
      overflow: 'hidden',
      backgroundColor: 'transparent',
      color: 'inherit',
      ':hover, :focus, :focus-within': {
        cursor: 'default',
        backgroundColor: 'list.hoverBackground',
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
          {BranchIcon}
          {/* <Icon aria-hidden color="#EDFFA5" name="contribution" size={16} /> */}
          <Element css={{ overflow: 'hidden' }}>
            <Tooltip label={branchName}>
              <Text size={3} weight="medium" maxWidth="100%">
                {branchName}
              </Text>
            </Tooltip>
          </Element>
        </Stack>
      </Column>
      <Column span={[0, 3, 3]} as={Stack} align="center">
        <Text size={3} variant={'muted'} maxWidth="100%">
          {branchLocation}
        </Text>
      </Column>
    </Grid>
    <IconButton
      name="more"
      size={9}
      title="Branch actions"
      onClick={() => ({})}
    />
  </ListAction>
);

export const SkeletonListItem = () => (
  <Stack
    paddingX={2}
    align="center"
    justify="space-between"
    css={css({
      height: 64,
      paddingX: 2,
      borderBottom: '1px solid',
      borderBottomColor: 'grays.600',
    })}
  >
    <Stack align="center" gap={4}>
      <SkeletonText css={{ height: 32, width: 32 }} />
      <SkeletonText css={{ width: 120 }} />
    </Stack>
    <SkeletonText css={{ width: 120 }} />
    <SkeletonText css={{ width: 120 }} />
  </Stack>
);
