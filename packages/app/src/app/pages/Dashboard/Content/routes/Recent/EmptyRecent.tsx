import { CreateCard, Stack, VideoCard } from '@codesandbox/components';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import React from 'react';

export const EmptyRecent: React.FC = () => {
  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledGrid>
        <CreateCard icon="plus" label="New from a template" />
        <CreateCard icon="github" label="Import from GitHub" />
        <CreateCard icon="addMember" label="Invite team members" />
        <VideoCard
          title="Getting Started with CodeSandbox"
          duration="4:40"
          durationLabel="4 minutes, 40 seconds"
          thumbnail="/static/img/thumbnails/recent_intro.png"
          url="https://www.youtube.com/watch?v=qcJECnz7vqM"
        />
      </EmptyPage.StyledGrid>
      <Stack direction="vertical" gap={6}>
        <EmptyPage.StyledGridTitle>
          Optimize your workflow
        </EmptyPage.StyledGridTitle>
      </Stack>
    </EmptyPage.StyledWrapper>
  );
};
