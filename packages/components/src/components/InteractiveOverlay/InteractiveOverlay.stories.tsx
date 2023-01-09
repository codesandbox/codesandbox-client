import React from 'react';
import styled from 'styled-components';

import { Card } from '../Card/Card';
import { Element } from '../Element';

import { InteractiveOverlay } from './InteractiveOverlay';

export default {
  title: 'components/facelift/InteractiveOverlay',
  component: InteractiveOverlay,
};

const dummyStyles = {
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  lineHeight: '14px',
  padding: '8px',
  border: '1px solid red',
  '&:hover': {
    backgroundColor: 'orange',
  },
};

const DummyAnchor = () => (
  <Element
    as="a"
    href="#"
    css={{
      textDecoration: 'none',
      ...dummyStyles,
    }}
  >
    anchor
  </Element>
);

const DummyButton = () => (
  <Element as="button" css={dummyStyles}>
    button
  </Element>
);

const DummyContent = () => (
  <>
    <p>This is other content.</p>
    <DummyAnchor />
    <DummyButton />
  </>
);

// Add hover styles to Card
// TODO: add this to Card
const NewCard = styled(Card)`
  &:hover {
    background-color: #252525;
  }
`;

export const InteractiveOverlayItem = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <NewCard>
        <InteractiveOverlay.Item>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">Interactive item</a>
        </InteractiveOverlay.Item>
        <DummyContent />
      </NewCard>
    </InteractiveOverlay>
  </Element>
);

export const InteractiveOverlayItemDisabled = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <NewCard>
        <InteractiveOverlay.Item>
          {/* eslint-disable-next-line react/button-has-type */}
          <button disabled>Interactive item</button>
        </InteractiveOverlay.Item>
        <DummyContent />
      </NewCard>
    </InteractiveOverlay>
  </Element>
);

export const InteractiveOverlayButton = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <NewCard>
        <InteractiveOverlay.Button>Interactive item</InteractiveOverlay.Button>
        <DummyContent />
      </NewCard>
    </InteractiveOverlay>
  </Element>
);

export const InteractiveOverlayButtonDisabled = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <NewCard>
        <InteractiveOverlay.Button disabled>
          Interactive item
        </InteractiveOverlay.Button>
        <DummyContent />
      </NewCard>
    </InteractiveOverlay>
  </Element>
);

export const InteractiveOverlayAnchor = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <NewCard>
        <InteractiveOverlay.Anchor href="#">
          Interactive item
        </InteractiveOverlay.Anchor>
        <DummyContent />
      </NewCard>
    </InteractiveOverlay>
  </Element>
);

export const WithBorderRadius = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <NewCard>
        <InteractiveOverlay.Item radius={4}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">Interactive item</a>
        </InteractiveOverlay.Item>
      </NewCard>
    </InteractiveOverlay>
  </Element>
);

export const WithWrapperElement = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay isElement>
      <NewCard>
        <InteractiveOverlay.Item>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">Interactive item</a>
        </InteractiveOverlay.Item>
      </NewCard>
    </InteractiveOverlay>
  </Element>
);
