import React from 'react';
import renderer from 'react-test-renderer';
import Message from './Message';

describe('Message', () => {
  test('it renders a dependency not found error', () => {
    const tree = renderer
      .create(
        <Message
          sandboxId="foeijf"
          error={{
            type: 'dependency-not-found',
            title: 'Dependency Not Found',
            message: 'Dependendnen',
            severity: 'error',
            moduleId: 'asfa',
            payload: {
              path: 'react-icons/fa/beer',
              dependency: 'react-icons',
            },
          }}
          modules={[
            {
              id: 'asfa',
              code: 'daowidj',
            },
          ]}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('it renders a warning', () => {
    const tree = renderer
      .create(
        <Message
          sandboxId="foeijf"
          error={{
            severity: 'warning',
            title: 'Loading dependencies',
          }}
          modules={[
            {
              id: 'asfa',
              code: 'daowidj',
            },
          ]}
        />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
