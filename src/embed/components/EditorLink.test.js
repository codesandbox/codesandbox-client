import React from 'react';
import testRender from 'app/utils/test/render';
import EditorLink from './EditorLink';

describe('EditorLink', () => {
  it('renders', () => {
    testRender(<EditorLink sandbox={{}} />);
  });
});
