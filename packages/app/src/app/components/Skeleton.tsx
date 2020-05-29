import Centered from '@codesandbox/common/es/components/flex/Centered';
import Fullscreen from '@codesandbox/common/es/components/flex/Fullscreen';
import { SubTitle } from 'app/components/SubTitle';
import { Title } from 'app/components/Title';
import React from 'react';

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
