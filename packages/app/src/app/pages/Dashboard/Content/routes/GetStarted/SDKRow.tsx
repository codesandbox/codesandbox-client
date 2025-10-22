import track from '@codesandbox/common/lib/utils/analytics';
import { ArticleCard, Text, Stack } from '@codesandbox/components';
import { Carousel } from 'app/pages/Dashboard/Components/Carousel/Carousel';
import React from 'react';

type ArticleProps = React.ComponentProps<typeof ArticleCard>;

type DocsItem = { label: string } & ArticleProps;

export const appendOnboardingTracking = (url: string): string => {
  const baseUrl = new URL(url);
  baseUrl.searchParams.append('utm_source', 'dashboard_onboarding');

  return baseUrl.toString();
};

const DOCS: DocsItem[] = [
  {
    label: 'docs_sdk_core-concepts',
    title: 'Core concepts',
    url: 'https://codesandbox.io/docs/sdk/core-concepts',
    thumbnail: '/static/img/thumbnails/docs_getting-started.png',
  },
  {
    label: 'docs_sdk_manage-sandboxes',
    title: 'Lifecycle management',
    url: 'https://codesandbox.io/docs/sdk/manage-sandboxes',
    thumbnail: '/static/img/thumbnails/youtube.png',
  },
  {
    label: 'docs_sdk_templates',
    title: 'Templates',
    url: 'https://codesandbox.io/docs/sdk/templates',
    thumbnail: '/static/img/thumbnails/blog_design-system.png',
  },
  {
    label: 'docs_sdk_cli',
    title: 'CLI Dashboard',
    url: 'https://codesandbox.io/docs/sdk/cli',
    thumbnail: '/static/img/thumbnails/video_command-palette.png',
  },
];

export const SDKRow = () => {
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
      Component: ArticleCard,
      props: {
        onClick: () => handleTrack(label),
        url: urlWithTracking,
        ...item,
      },
    };
  });

  return (
    <Stack direction="vertical" gap={4}>
      <Text as="h3" margin={0} size={4} weight="400">
        Get started with the SDK
      </Text>
      <Carousel items={items} />
    </Stack>
  );
};

