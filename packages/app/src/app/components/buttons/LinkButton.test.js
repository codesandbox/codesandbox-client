import React from 'react';
import testRender from 'app/utils/test/render';
import LinkButton from './LinkButton';

describe('LinkButton', () => {
  it('renders', () => {
    testRender(<LinkButton>Test</LinkButton>);
  });

  it('renders onClick', () => {
    testRender(<LinkButton onClick={() => {}}>Test</LinkButton>);
  });
});
