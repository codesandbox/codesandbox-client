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
    label: 'video_contribution-branches',
    title: 'Contribute easily with Contribution branches',
    duration: '5:33',
    durationLabel: '5 minutes, 33 seconds',
    url: 'https://www.youtube.com/watch?v=HCs49B6VVl8',
    thumbnail: '/static/img/thumbnails/docs_contribution-branches.png',
  },
  {
    label: 'blog_github-app',
    title: 'Review code faster with our GitHub App',
    url: 'https://codesandbox.io/post/introducing-the-codesandbox-github-app',
    thumbnail: '/static/img/thumbnails/docs_github-app.png',
  },
  {
    label: 'video_vs-code',
    title: 'Working locally with the VSCode Extension',
    duration: '3:02',
    durationLabel: '3 minutes, 2 seconds',
    url: 'https://www.youtube.com/watch?v=ZJ1sNiTZw5M',
    thumbnail: '/static/img/thumbnails/docs_vscode-extension.png',
  },
  {
    label: 'blog-iOS',
    title: 'Code with our native iOS App',
    url:
      'https://codesandbox.io/post/how-to-code-your-app-using-the-codesandbox-ipad-ide',
    thumbnail: '/static/img/thumbnails/docs_ipad.png',
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
