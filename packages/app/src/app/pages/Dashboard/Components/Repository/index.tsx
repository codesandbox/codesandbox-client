import React from 'react';
import {
  Element,
  Column,
  Grid,
  Icon,
  IconButton,
  ListAction,
  Stack,
  Text,
} from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useAppState } from 'app/overmind';
import { useHistory } from 'react-router-dom';
import { DashboardRepository } from '../../types';

export const Repository: React.FC<DashboardRepository> = ({ repository }) => {
  const { branches, repository: providerRepository } = repository;
  const {
    dashboard: { viewMode },
  } = useAppState();
  const ariaLabel = `View branches from repository ${providerRepository.name} by ${providerRepository.owner}`;
  const branchesLabel = `${branches.length} ${
    branches.length === 1 ? 'branch' : 'branches'
  }`;
  const history = useHistory();

  // TODO: replace with double click action when/if implemeting the context menu
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // TODO: add analytics
    const url = `/dashboard/repositories/github/${providerRepository.owner}/${providerRepository.name}`;
    if (e.ctrlKey || e.metaKey) {
      window.open(url, '_blank');
    } else {
      history.push(url);
    }
  };

  if (viewMode === 'grid') {
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
          border: '1px solid transparent',
          backgroundColor: 'card.background',
          transition: 'background ease-in-out',
          padding: 4,
          outline: 'none',

          transitionDuration: theme => theme.speeds[2],
          ':hover': {
            backgroundColor: 'card.backgroundHover',
          },
          ':focus-visible': {
            borderColor: 'focusBorder',
          },
        })}
        direction="vertical"
        gap={4}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick(e)}
        // TODO: refine semantics when/if the context menu gets implemented.
        role="link"
        tabIndex={0}
      >
        <IconButton
          css={css({
            marginLeft: 'auto',
            marginRight: 0,
          })}
          name="more"
          size={9}
          title="Branch actions"
          onClick={() => ({})}
        />
        <Stack align="center" direction="vertical" gap={6}>
          <Icon aria-hidden color="#808080" name="pr" size={24} />
          <Stack align="center" direction="vertical" gap={2}>
            <Text
              css={css({
                color: '#E5E5E5',
                textAlign: 'center',
              })}
              size={16}
            >
              {providerRepository.owner}/{providerRepository.name}
            </Text>
            <Text
              css={css({
                color: '#808080',
                textAlign: 'center',
              })}
              size={13}
            >
              {branchesLabel}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    );
  }

  if (viewMode === 'list') {
    return (
      <ListAction
        align="center"
        onClick={handleClick}
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
              <Icon aria-hidden color="#808080" name="pr" size={16} />
              <Element css={{ overflow: 'hidden' }}>
                <Text size={3} weight="medium" maxWidth="100%">
                  {providerRepository.owner}/{providerRepository.name}
                </Text>
              </Element>
            </Stack>
          </Column>
          <Column span={[0, 3, 3]} as={Stack} align="center">
            <Text size={3} variant="muted" maxWidth="100%">
              {branchesLabel}
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
  }

  /**
   * Satisfy expected return from React.FC
   */
  return null;
};
