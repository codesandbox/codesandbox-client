import React from 'react';
import styled from 'styled-components';

import { Text } from '@codesandbox/components';

const Wrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.24), 0px 4px 4px rgba(0, 0, 0, 0.12);

  display: flex;
  flex-direction: column;

  min-width: calc(100vw / 3);
  margin-right: 1rem;
  position: relative;
`;

const ImageWrap = styled.div`
  flex: 1;

  img {
    width: 100%;
  }
`;

const Content = styled.div`
  background: #fff;

  padding: 1.5rem 2.5rem;
  color: #242424;
  min-height: 224px;

  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Card: React.FC<Record<
  'title' | 'tagline' | 'img' | 'bgColor',
  string
>> = ({ title, tagline, img, bgColor, ...props }) => (
  <Wrapper {...props}>
    <ImageWrap style={{ backgroundColor: bgColor }}>
      <img src={img} alt={title} />
    </ImageWrap>

    <Content>
      <Text
        weight="bold"
        size={6}
        block
        as="h2"
        css={{ margin: 0, marginBottom: '.75rem' }}
      >
        {title}
      </Text>
      <Text block as="p" size={4} css={{ lineHeight: '24px' }}>
        {tagline}
      </Text>
    </Content>
  </Wrapper>
);
