import React from 'react';
import { InteractiveOverlay } from './InteractiveOverlay';
import { Element } from '../Element';
import { Card } from '../Card/Card';

export default {
  title: 'components/facelift/InteractiveOverlay',
  component: InteractiveOverlay,
};

const dummyStyles = {
  padding: '8px',
  border: '1px solid red',
  '&:hover': {
    backgroundColor: 'orange',
  },
};

const DummyAnchor = () => (
  <Element as="a" href="#" css={dummyStyles}>
    anchor
  </Element>
);

const DummyButton = () => (
  <Element as="button" css={dummyStyles}>
    button
  </Element>
);

export const AsButton = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <Card>
        <InteractiveOverlay.Item as="button">
          Interactive item
        </InteractiveOverlay.Item>
        <div>other content</div>
        <DummyAnchor />
        <DummyButton />
      </Card>
    </InteractiveOverlay>
  </Element>
);

export const AsAnchor = () => (
  <Element css={{ padding: '20px' }}>
    <InteractiveOverlay>
      <Card>
        <InteractiveOverlay.Item as="a" href="#">
          Interactive item
        </InteractiveOverlay.Item>
        <div>other content</div>
        <DummyAnchor />
        <DummyButton />
      </Card>
    </InteractiveOverlay>
  </Element>
);

export const WrapperElement = () => (
  <Element css={{ padding: '20px' }}>
    <Element paddingBottom={4}>Without wrapper element:</Element>
    <div>
      <span>Next to the overlay </span>
      <InteractiveOverlay>
        <span>
          <InteractiveOverlay.Item as="a" href="#">
            Interactive item
          </InteractiveOverlay.Item>
        </span>
      </InteractiveOverlay>
    </div>

    <Element paddingBottom={8} />

    <Element paddingBottom={4}>With wrapper element:</Element>
    <div>
      <span>Above to the overlay </span>
      <InteractiveOverlay isElement>
        <span>
          <InteractiveOverlay.Item as="a" href="#">
            Interactive item
          </InteractiveOverlay.Item>
        </span>
      </InteractiveOverlay>
    </div>
  </Element>
);
