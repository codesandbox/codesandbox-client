import React from 'react';
import testRender from 'app/utils/test/render';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button';

describe('Button', () => {
  it('renders', () => {
    testRender(<Button>Test</Button>);
  });

  it('renders onClick', () => {
    testRender(<Button onClick={() => {}}>Test</Button>);
  });

  it('renders hrefs', () => {
    testRender(
      <MemoryRouter>
        <Button to="https://ivesvh.com">Test</Button>
      </MemoryRouter>,
    );
  });

  it('renders properties', () => {
    testRender(<Button small>Test</Button>);
  });

  it('renders disabled', () => {
    testRender(<Button disabled>Test</Button>);
  });
});
