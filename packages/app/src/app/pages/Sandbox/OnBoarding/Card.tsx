import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { Text } from '@codesandbox/components';

export const Card = forwardRef<
  HTMLDivElement,
  {
    title: string;
    align: string;
    tagline: string;
    img: string;
    bgColor: string;
    active: boolean;
    onClick: () => void;
  }
>(({ title, tagline, img, bgColor, active, onClick, align, ...props }, ref) => (
  <Container active={active} ref={ref} onClick={onClick} {...props}>
    <ImageContainer
      style={{
        backgroundColor: bgColor,
        alignItems: align === 'bottom' ? 'flex-end' : 'center',
      }}
    >
      <img src={img} alt={title} />
    </ImageContainer>

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
  </Container>
));

const Container = styled.div<{ active: boolean }>`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 16px 32px rgba(0, 0, 0, 0.24), 0px 4px 4px rgba(0, 0, 0, 0.12);

  display: flex;
  flex-direction: column;

  margin-right: 0.5rem;
  margin-left: 0.5rem;
  position: relative;

  transition: opacity 0.3s ease;
  opacity: ${({ active }) => (active ? 1 : 0.2)};

  min-width: 86vw;

  @media screen and (min-width: 680px) {
    min-width: 400px;
  }

  @media screen and (min-width: 1700px) {
    min-width: calc(100vw / 5);
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding-bottom: 240px;

  img {
    width: 100%;
  }
`;

const Content = styled.div`
  background: #fff;

  padding: 1.5rem 2.5rem;
  color: #242424;
  min-height: 240px;

  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;
