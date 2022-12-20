import track from '@codesandbox/common/lib/utils/analytics';
import { ArticleCard, VideoCard, Stack } from '@codesandbox/components';
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
    label: 'video_one-click-pr',
    title: 'One-click PR',
    duration: '0:23',
    durationLabel: '23 seconds',
    url:
      'https://www.youtube.com/watch?v=YpY8oznHq2I&list=PLdX6VQdTP7GbG1Poi8JN3AJsHAsSM2IlW&index=6',
    thumbnail: '/static/img/thumbnails/video_1-click-pr.png',
  },
  {
    label: 'video_contribution-branches',
    title: 'Easy open source with Contribution branches',
    duration: '5:33',
    durationLabel: '5 minutes, 33 seconds',
    url: 'https://www.youtube.com/watch?v=HCs49B6VVl8',
    thumbnail: '/static/img/thumbnails/video_contribution-branches.png',
  },

  {
    label: 'video_command-palette',
    title: 'Using the Command Palette',
    duration: '0:48',
    durationLabel: '48 seconds',
    url:
      'https://www.youtube.com/watch?v=OUBYFp0Yz2A&list=PLdX6VQdTP7GbG1Poi8JN3AJsHAsSM2IlW&index=7',
    thumbnail: '/static/img/thumbnails/video_command-palette.png',
  },
  {
    label: 'video_auto-deps-install',
    title: 'Automatic Dependency Management',
    duration: '1:18',
    durationLabel: '1 minute, 18 seconds',
    url: 'https://www.youtube.com/watch?v=ZJ1sNiTZw5M',
    thumbnail: '/static/img/thumbnails/video_auto-deps.png',
  },
  {
    label: 'blog_github-app',
    title: 'Review code faster with our GitHub App',
    url: 'https://codesandbox.io/post/introducing-the-codesandbox-github-app',
    thumbnail: '/static/img/thumbnails/blog_github-app.png',
  },
  {
    label: 'cta_youtube',
    title: 'More videos and tutorials',
    url: 'https://www.youtube.com/@codesandbox',
    thumbnail: '/static/img/thumbnails/youtube.png',
  },
  {
    label: 'cta_blog',
    title: 'Latest news and releases',
    url: 'https://codesandbox.io/blog',
    thumbnail: '/static/img/thumbnails/blog.png',
  },
];

export const DocumentationRow: React.FC = () => {
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
        Optimize your workflow
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
      </EmptyPage.StyledGrid>
    </Stack>
  );
};
