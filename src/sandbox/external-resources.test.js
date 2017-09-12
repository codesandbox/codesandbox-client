import { addResource } from './external-resources';

describe('addResource', () => {
  it('adds URLs that end with "css" as CSS', () => {
    const addCSS = jest.fn();
    const resource =
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css';
    addResource(resource, addCSS);
    expect(addCSS).toHaveBeenCalled();
  });

  it('adds all other URLs as JS', () => {
    const addJS = jest.fn();
    const resource = 'foo';
    addResource(resource, undefined, addJS);
    expect(addJS).toHaveBeenCalled();
  });
});
