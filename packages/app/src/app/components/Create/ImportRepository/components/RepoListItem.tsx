import React from 'react';
import { Stack, Icon, Text, InteractiveOverlay } from '@codesandbox/components';
import { VisuallyHidden } from 'reakit';
import { formatDistanceStrict } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import styled from 'styled-components';
import { GithubRepoToImport } from '../../utils/types';

export type RepoListItemProps = {
  repo: GithubRepoToImport;
  onClicked: () => void;
};

export const RepoListItem = ({ repo, onClicked }) => {
  return (
    <InteractiveOverlay key={repo.id}>
      <StyledItem>
        <Stack gap={2} align="center">
          <Icon name="repository" />
          <InteractiveOverlay.Button
            onClick={() => {
              onClicked();
            }}
          >
            <VisuallyHidden>Select</VisuallyHidden>
            <Text size={13}>{repo.name}</Text>
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

  &:hover,
  &:focus-within {
    background-color: #252525;
  }
`;
