import getDirectChildren from './get-direct-children';

describe('get-direct-children', () => {
  const defaultItems = [
    { path: '/test' },
    { path: '/test/test2' },
    { path: '/test2' },
  ];

  it('works with root path', () => {
    const root = '/';

    expect(getDirectChildren(root, defaultItems)).toMatchSnapshot();
  });

  it('works with sub paths', () => {
    const root = '/test';

    expect(getDirectChildren(root, defaultItems)).toMatchSnapshot();
  });

  it('works with deeper paths', () => {
    const items = [
      { path: '/test/test2/test3' },
      { path: '/test/test2' },
      { path: '/test/test3' },
      { path: '/test/test2/test4' },
      { path: '/test/test2/test3' },
    ];

    expect(getDirectChildren('/test', items)).toMatchSnapshot();
  });
});
