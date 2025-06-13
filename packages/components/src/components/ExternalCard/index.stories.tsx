import React from 'react';
import styled from 'styled-components';
import { ArticleCard } from './ArticleCard';
import { VideoCard } from './VideoCard';

const StyledWraperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  height: 154px;
`;

export default {
  title: 'components/facelift/ExternalCard',
};

const article = {
  title: 'How to code your app using the CodeSandbox iPad IDE',
  url:
    'https://codesandbox.io/post/how-to-code-your-app-using-the-codesandbox-ipad-ide',
  thumbnail:
    'https://codesandbox.io/static/codesandbox-ipad-ide-cover-01937cea05823dd2253a6ad6e0823db5.png',
};

const video = {
  duration: '7:21',
  durationLabel: '7 minutes, 21 seconds',
  title:
    "Updated pricing, Cloud sandboxes and more | What's new at CodeSandbox November 2022",
  url: 'https://www.youtube.com/watch?v=VDA41MYOYNI',
  thumbnail:
    'https://i.ytimg.com/vi/VDA41MYOYNI/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDn88tm1ouxCTFFnhBdQ5zznDWfWg',
};

const thumbless = {
  title: 'Uploading Static Files',
  url:
    'https://codesandbox.io/docs/learn/vm-sandboxes/upload',
  thumbnail: 'https://malformed-url.com',
};

export const ArticleVariant = () => (
  <StyledWraperGrid>
    <ArticleCard {...article} />
  </StyledWraperGrid>
);

export const ThumblessVariant = () => (
  <StyledWraperGrid>
    <ArticleCard {...thumbless} />
  </StyledWraperGrid>
);

export const VideoVariant = () => (
  <StyledWraperGrid>
    <VideoCard {...video} />
  </StyledWraperGrid>
);
