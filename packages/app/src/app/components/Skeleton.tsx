import React from 'react';
import Fullscreen from '@codesandbox/common/lib/components/flex/Fullscreen';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';

interface ISkeletonProps {
  titles: {
    delay: number;
    content: React.ReactNode;
  }[];
}

export const Skeleton: React.FC<ISkeletonProps> = ({ titles }) => (
  <Fullscreen style={{ height: '100vh' }}>
    <Centered horizontal vertical>
      <Title delay={titles[0].delay}>{titles[0].content}</Title>
      {titles.slice(1).map((title, index) => (
        // eslint-disable-next-line
        <SubTitle key={index} delay={title.delay}>
          {title.content}
        </SubTitle>
      ))}
    </Centered>
  </Fullscreen>
);
