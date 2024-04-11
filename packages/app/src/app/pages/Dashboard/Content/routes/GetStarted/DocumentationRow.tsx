import track from '@codesandbox/common/lib/utils/analytics';
import { ArticleCard, VideoCard, Stack, Text } from '@codesandbox/components';
import { blogUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Carousel } from 'app/pages/Dashboard/Components/Carousel/Carousel';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import React from 'react';

type ArticleProps = React.ComponentProps<typeof ArticleCard>;
type VideoProps = React.ComponentProps<typeof VideoCard>;

type DocsItem = { label: string } & (VideoProps | ArticleProps);

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
    label: 'blog_github-app',
    title: 'Review code faster with our GitHub App',
    url: 'https://codesandbox.io/post/introducing-the-codesandbox-github-app',
    thumbnail: '/static/img/thumbnails/blog_github-app.png',
  },
  {
    label: 'video_auto-deps-install',
    title: 'Automatic Dependency Management',
    duration: '1:18',
    durationLabel: '1 minute, 18 seconds',
    url: 'https://www.youtube.com/watch?v=vS_FUWyBMZI',
    thumbnail: '/static/img/thumbnails/video_auto-deps.png',
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
    url: blogUrl(),
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

  const items = DOCS.map(({ label, url, ...item }) => {
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
  }).filter(Boolean);

  return (
    <Stack direction="vertical" gap={4}>
      <Text as="h3" margin={0} size={4} weight="400">
        Optimize your workflow
      </Text>
      <Carousel items={items} />
    </Stack>
  );
};
