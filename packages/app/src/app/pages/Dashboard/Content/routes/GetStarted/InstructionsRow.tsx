import track from '@codesandbox/common/lib/utils/analytics';
import { ArticleCard, VideoCard, Text, Stack } from '@codesandbox/components';
import { Carousel } from 'app/pages/Dashboard/Components/Carousel/Carousel';
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
    label: 'docs_getting-started',
    title: 'Getting started with CodeSandbox',
    duration: '5:00',
    durationLabel: '5 minutes, 00 seconds',
    url: 'https://www.youtube.com/watch?v=aSDSpRxkTnY',
    thumbnail: '/static/img/thumbnails/docs_getting-started.png',
  },
  {
    label: 'video_vs-code',
    title: 'Working locally with the VS Code Extension',
    duration: '3:02',
    durationLabel: '3 minutes, 2 seconds',
    url: 'https://www.youtube.com/watch?v=ZJ1sNiTZw5M',
    thumbnail: '/static/img/thumbnails/docs_vscode-extension.png',
  },
  {
    label: 'video_code-reviews',
    title: 'Review PRs in CodeSandbox',
    duration: '3:56',
    durationLabel: '3 minutes, 56 seconds',
    url: 'https://www.youtube.com/watch?v=dRkpuUMHCNQ',
    thumbnail: '/static/img/thumbnails/video_code-reviews.png',
  },
  {
    label: 'video_postgres',
    title: 'Adding a Postgres Database in CodeSandbox',
    duration: '9:02',
    durationLabel: '9 minutes, 2 seconds',
    url: 'https://www.youtube.com/watch?v=1ZHrwJHoKOw',
    thumbnail: '/static/img/thumbnails/video_postgres-tutorial.jpg',
  },
  {
    label: 'blog_design-system',
    title: 'How To Use CodeSandbox with Your Design System',
    url:
      'https://codesandbox.io/blog/how-to-use-codesandbox-with-your-design-system',
    thumbnail: '/static/img/thumbnails/blog_design-system.png',
  },
];

export const InstructionsRow: React.FC = () => {
  const handleTrack = (label: string) => {
    track('Empty State Card - Content card', {
      codesandbox: 'V1',
      event_source: 'UI',
      card_type: label,
    });
  };

  return (
    <Stack direction="vertical" gap={4}>
      <Text as="h3" margin={0} size={4} weight="400">
        Get started with CodeSandbox
      </Text>
      <Carousel
        items={DOCS.map(({ label, url, ...item }) => {
          const urlWithTracking = appendOnboardingTracking(url);

          return {
            id: label,
            Component: 'duration' in item ? VideoCard : ArticleCard,
            props: {
              onClick: () => handleTrack(label),
              url: urlWithTracking,
              ...item,
            },
          };
        })}
      />
    </Stack>
  );
};
