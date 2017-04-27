import renderer from 'react-test-renderer';

export default Component => {
  const tree = renderer.create(Component).toJSON();
  expect(tree).toMatchSnapshot();
};
