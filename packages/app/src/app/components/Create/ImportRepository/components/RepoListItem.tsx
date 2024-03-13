import React from 'react';
import { Stack, Icon, Text, InteractiveOverlay } from '@codesandbox/components';
import { VisuallyHidden } from 'reakit';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import styled from 'styled-components';
import { GithubRepoToImport } from '../../utils/types';

export type RepoListItemProps = {
  repo: GithubRepoToImport;
  isImported: boolean;
  onClicked: () => void;
};

export const RepoListItem = ({ repo, isImported, onClicked }) => {
  return (
    <InteractiveOverlay key={repo.id}>
      <StyledItem>
        <Stack justify="space-between" css={{ width: '100%' }}>
          <Stack gap={2} align="center">
            <Icon
              name={isImported ? 'repository' : 'github'}
              color={isImported ? '#999999' : 'inherit'}
            />
            <InteractiveOverlay.Button
              onClick={() => {
                onClicked();
              }}
            >
              <VisuallyHidden>Select</VisuallyHidden>
              <Text size={13} color={isImported ? '#999999' : 'inherit'}>
                {repo.name}
              </Text>
            </InteractiveOverlay.Button>

            {repo.private ? (
              <>
                <VisuallyHidden>Private repository</VisuallyHidden>
                <Icon name="lock" color="#999999" />
              </>
            ) : null}
            {repo.pushedAt ? (
              <Text size={13} color="#999999B3">
                <VisuallyHidden>Last updated</VisuallyHidden>
                {formatDistanceStrict(
                  zonedTimeToUtc(repo.pushedAt, 'Etc/UTC'),
                  new Date(),
                  {
                    addSuffix: true,
                  }
                )}
              </Text>
            ) : null}
          </Stack>
          <Stack css={{ pointerEvents: 'none' }} className="label" gap={2}>
            <Icon size={16} name={isImported ? 'boxDevbox' : 'plus'} />
            <Text size={13}>{isImported ? 'Open' : 'Import'}</Text>
          </Stack>
        </Stack>
      </StyledItem>
    </InteractiveOverlay>
  );
};

export const StyledItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;
  background-color: #1d1d1d;
  border-radius: 4px;
  height: 32px;
  align-items: center;

  .label {
    translate: 8px;
    opacity: 0;
    transition: all 0.125s ease-in-out;
  }

  &:hover,
  &:focus-within {
    background-color: #252525;

    .label {
      opacity: 1;
      translate: 0;
    }
  }
`;
