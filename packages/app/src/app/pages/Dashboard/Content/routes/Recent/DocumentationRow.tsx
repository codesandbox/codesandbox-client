import track from '@codesandbox/common/lib/utils/analytics';
import { ArticleCard, VideoCard } from '@codesandbox/components';
import { blogUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { Carousel } from 'app/pages/Dashboard/Components/Carousel/Carousel';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import React from 'react';

type ArticleProps = React.ComponentProps<typeof ArticleCard>;
type VideoProps = React.ComponentProps<typeof VideoCard>;

type DocsItem = { label: string; workspaceType?: 'personal' | 'team' } & (
  | VideoProps
  | ArticleProps
);

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
    label: 'video_contribution-branches',
    title: 'Easy open source with Contribution branches',
    duration: '5:33',
    durationLabel: '5 minutes, 33 seconds',
    url: 'https://www.youtube.com/watch?v=HCs49B6VVl8',
    thumbnail: '/static/img/thumbnails/video_contribution-branches.png',
    workspaceType: 'team',
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
  const { isPersonalSpace, isTeamSpace } = useWorkspaceAuthorization();

  const handleTrack = (label: string) => {
    track('Empty State Card - Content card', {
      codesandbox: 'V1',
      event_source: 'UI',
      card_type: label,
    });
  };

  const items = DOCS.map(({ label, url, workspaceType, ...item }) => {
    if (
      (workspaceType === 'personal' && !isPersonalSpace) ||
      (workspaceType === 'team' && !isTeamSpace)
    ) {
      return null;
    }

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
    <EmptyPage.StyledGridWrapper>
      <EmptyPage.StyledGridTitle>
        Optimize your workflow
      </EmptyPage.StyledGridTitle>
      <Carousel items={items} />
    </EmptyPage.StyledGridWrapper>
  );
};
