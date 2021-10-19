import React, { forwardRef } from 'react';
import styled from 'styled-components';
import track from '@codesandbox/common/lib/utils/analytics';

import { Text, Button } from '@codesandbox/components';

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
    onComplete: () => void;
    cta?: string;
    cover?: boolean;
  }
>(
  (
    {
      title,
      tagline,
      img,
      bgColor,
      active,
      onClick,
      onComplete,
      align,
      cta,
      cover,
      ...props
    },
    ref
  ) => (
    <Ratio>
      <Container active={active} ref={ref} onClick={onClick} {...props}>
        <ImageContainer
          style={{
            backgroundColor: bgColor,
            backgroundImage: `url(${img})`,
            backgroundSize: cover ? 'cover' : 'contain',
            backgroundPosition: align === 'bottom' ? `center bottom` : 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {title && tagline && (
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
        )}

        {cta && (
          <Content css={{ display: 'flex', padding: '0 16%' }}>
            <Button
              onClick={() => {
                track('OnBoarding - click on start cta');
                track('OnBoarding - complete');
                onComplete();
              }}
              css={{
                fontSize: 17,
                height: 35,
                borderRadius: 3,
                margin: 'auto',
              }}
            >
              {cta}
            </Button>
          </Content>
        )}
      </Container>
    </Ratio>
  )
);

const Ratio = styled.div`
  min-width: 80vw;
  height: 100%;

  @media screen and (min-width: 420px) {
    min-width: 86vw;
    height: 0;
    padding-bottom: 30%;
    max-height: 70vh;

    position: relative;
  }

  @media screen and (min-width: 680px) {
    min-width: 400px;
  }

  @media screen and (min-width: 1700px) {
    min-width: calc(100vw / 5);
  }
`;

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

  height: 100%;

  @media screen and (min-width: 420px) {
    height: auto;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  img {
    width: 100%;
  }
`;

const Content = styled.div`
  background: #fff;

  padding: 1.5rem 2.5rem;
  color: #242424;
  min-height: 230px;

  box-sizing: border-box;
`;
