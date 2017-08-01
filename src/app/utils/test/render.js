import renderer from 'react-test-renderer';
import 'jest-styled-components';

export default Component => {
  const tree = renderer.create(Component).toJSON();
  expect(tree).toMatchSnapshot();
};
