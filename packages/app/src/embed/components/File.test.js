import React from 'react';
import testRender from 'app/utils/test/render';
import File from './File';

describe('File', () => {
  it('renders', () => {
    testRender(<File title="Test" type="module" />);
  });

  it('renders as active', () => {
    testRender(<File active title="Test" type="module" />);
  });

  it('renders directory', () => {
    testRender(<File title="Test" type="directory" />);
  });

  it('renders alternative', () => {
    testRender(<File title="Test" alternative type="directory" />);
  });
});
