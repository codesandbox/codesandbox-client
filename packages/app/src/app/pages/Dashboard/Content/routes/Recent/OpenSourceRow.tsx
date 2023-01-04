import track from '@codesandbox/common/lib/utils/analytics';
import { v2DefaultBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import {
  ArticleCard,
  VideoCard,
  Stack,
  CreateCard,
} from '@codesandbox/components';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import React from 'react';

type ArticleProps = React.ComponentProps<typeof ArticleCard>;
type VideoProps = React.ComponentProps<typeof VideoCard>;

type DocsItem = { label: string } & (VideoProps | ArticleProps);

const DOCS: DocsItem[] = [
  {
    label: 'video_contribution-branches',
    title: 'Easy open source with Contribution branches',
    duration: '5:33',
    durationLabel: '5 minutes, 33 seconds',
    url: 'https://www.youtube.com/watch?v=HCs49B6VVl8',
    thumbnail: '/static/img/thumbnails/video_contribution-branches.png',
  },
];

const SUGGESTED_REPOS = [
  {
    owner: 'facebook',
    name: 'lexical',
  },
  {
    owner: 'codesandbox',
    name: 'sandpack',
  },
  {
    owner: 'pallets',
    name: 'flask',
  },
];

export const OpenSourceRow: React.FC = () => {
  const handleTrack = (label: string) => {
    track('Empty State Card - Content card', {
      codesandbox: 'V1',
      event_source: 'UI',
      card_type: label,
    });
  };

  return (
    <EmptyPage.StyledGridWrapper>
      <EmptyPage.StyledGridTitle>
        Open source development
      </EmptyPage.StyledGridTitle>
      <EmptyPage.StyledGrid as="ul">
        {DOCS.map(({ url, ...item }) => {
          const urlWithTracking = appendOnboardingTracking(url);

          return (
            <Stack as="li" key={item.label}>
              {'duration' in item ? (
                <VideoCard
                  onClick={() => handleTrack(item.label)}
                  url={urlWithTracking}
                  {...item}
                />
              ) : (
                <ArticleCard
                  onClick={() => handleTrack(item.label)}
                  url={urlWithTracking}
                  {...item}
                />
              )}
            </Stack>
          );
        })}
        {SUGGESTED_REPOS.map(({ owner, name }) => {
          const slug = `${owner}/${name}`;
          const url = v2DefaultBranchUrl({
            owner,
            repoName: name,
            source: 'dashboard_onboarding',
          });

          return (
            <Stack as="li" key={slug}>
              <CreateCard
                icon="github"
                label={owner}
                title={name}
                onClick={() => {
                  track('Empty State Card - Open suggested repository', {
                    repo: slug,
                    codesandbox: 'V1',
                    event_source: 'UI',
                    card_type: 'get-started-action',
                  });

                  window.location.href = url;
                }}
              />
            </Stack>
          );
        })}
      </EmptyPage.StyledGrid>
    </EmptyPage.StyledGridWrapper>
  );
};
