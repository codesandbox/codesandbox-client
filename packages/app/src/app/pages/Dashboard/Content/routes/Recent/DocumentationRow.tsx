import { ArticleCard, VideoCard, Stack } from '@codesandbox/components';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import React from 'react';

type ArticleProps = React.ComponentProps<typeof ArticleCard>;
type VideoProps = React.ComponentProps<typeof VideoCard>;

type DocsItem = { label: string } & (VideoProps | ArticleProps);

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
  return (
    <Stack direction="vertical" gap={6}>
      <EmptyPage.StyledGridTitle>
        Optimize your workflow
      </EmptyPage.StyledGridTitle>
      <EmptyPage.StyledGrid as="ul">
        {DOCS.map(item => (
          <Stack as="li" key={item.url}>
            {'duration' in item ? (
              <VideoCard {...item} />
            ) : (
              <ArticleCard {...item} />
            )}
          </Stack>
        ))}
      </EmptyPage.StyledGrid>
    </Stack>
  );
};
