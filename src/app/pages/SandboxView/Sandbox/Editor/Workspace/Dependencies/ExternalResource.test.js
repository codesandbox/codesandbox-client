import React from 'react';
import renderer from 'react-test-renderer';
import ExternalResource from './ExternalResource';

describe('ExternalResource', () => {
  it('renders file if there is an extension', () => {
    const tree = renderer
      .create(<ExternalResource resource="https://ivesvh.com/ives.js" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders url if there is no extension', () => {
    const tree1 = renderer
      .create(<ExternalResource resource="https://ivesvh.com/" />)
      .toJSON();

    const tree2 = renderer
      .create(<ExternalResource resource="https://ivesvh.com" />)
      .toJSON();

    expect(tree1).toMatchSnapshot();
    expect(tree2).toMatchSnapshot();
  });
});
