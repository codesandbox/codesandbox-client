import track from '@codesandbox/common/lib/utils/analytics';
import {
  ArticleCard,
  VideoCard,
  Stack,
  CreateCard,
} from '@codesandbox/components';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import React from 'react';

type ArticleProps = React.ComponentProps<typeof ArticleCard>;
type VideoProps = React.ComponentProps<typeof VideoCard>;

type DocsItem = { label: string } & (VideoProps | ArticleProps);

export const appendOnboardingTracking = (url: string): string => {
  const baseUrl = new URL(url);
  baseUrl.searchParams.append('utm_source', 'dashboard_onboarding');

  return baseUrl.toString();
};

const DOCS: DocsItem[] = [
  {
    label: 'video_contribution-branches',
    title: 'Contribute easily with Contribution branches',
    duration: '5:33',
    durationLabel: '5 minutes, 33 seconds',
    url: 'https://www.youtube.com/watch?v=HCs49B6VVl8',
    thumbnail: '/static/img/thumbnails/docs_contribution-branches.png',
  },
];

const SUGGESTED_REPOS = [
  {
    owner: 'facebook',
    name: 'lexical',
    url: 'https://codesandbox.io/p/github/facebook/lexical',
  },
  {
    owner: 'codesandbox',
    name: 'sandpack',
    url: 'https://codesandbox.io/p/github/codesandbox/sandpack',
  },
  {
    owner: 'pallets',
    name: 'flask',
    url: 'https://codesandbox.io/p/github/pallets/flask',
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
    <Stack direction="vertical" gap={6}>
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
        {SUGGESTED_REPOS.map(r => {
          const slug = `${r.owner}/${r.name}`;

          return (
            <Stack as="li" key={slug}>
              <CreateCard
                icon="github"
                label={r.owner}
                title={r.name}
                onClick={() => {
                  track('Empty State Card - Open suggested repository', {
                    repo: slug,
                    codesandbox: 'V1',
                    event_source: 'UI',
                    card_type: 'get-started-action',
                  });
                  window.open(appendOnboardingTracking(r.url));
                }}
              />
            </Stack>
          );
        })}
      </EmptyPage.StyledGrid>
    </Stack>
  );
};
