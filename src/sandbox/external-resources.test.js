import { addResource } from './external-resources';

describe('addResource', () => {
  it('adds URLs that end with "css" as CSS', () => {
    const addCSS = jest.fn();
    const resource = 'resource.css';
    addResource(resource, addCSS);
    expect(addCSS).toHaveBeenCalled();
  });

  it('adds URLs that end with "js" as JS', () => {
    const addJS = jest.fn();
    const resource = 'resource.js';
    addResource(resource, jest.fn(), addJS);
    expect(addJS).toHaveBeenCalled();
  });

  it('checks content type if the file has an unknown ending', () => {
    const getContentType = jest.fn();
    getContentType.mockReturnValue(Promise.resolve('text/css'));
    const resource = 'resource';
    addResource(resource, jest.fn(), jest.fn(), getContentType);
    expect(getContentType).toHaveBeenCalled();
  });

  it('throws an error for unknown content types', () => {
    const getContentType = jest.fn();
    getContentType.mockReturnValue(Promise.resolve('foo'));
    const resource = 'resource';
    addResource(resource, jest.fn(), jest.fn(), getContentType).catch(e => {
      expect(e).toBeInstanceOf(Error);
    });
  });

  it('adds "text/css" as CSS', () => {
    const addCSS = jest.fn();
    const getContentType = jest.fn();
    getContentType.mockReturnValue(Promise.resolve('text/css'));
    const resource = 'resource';
    addResource(resource, addCSS, jest.fn(), getContentType).then(() => {
      expect(addCSS).toHaveBeenCalled();
    });
  });

  it('adds "application/javascript" as JS', () => {
    const addJS = jest.fn();
    const getContentType = jest.fn();
    getContentType.mockReturnValue(Promise.resolve('application/javascript'));
    const resource = 'resource';
    addResource(resource, jest.fn(), addJS, getContentType).then(() => {
      expect(addJS).toHaveBeenCalled();
    });
  });
});
