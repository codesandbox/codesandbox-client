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

  it('renders to', () => {
    testRender(
      <MemoryRouter>
        <Button to="https://ivesvh.com">Test</Button>
      </MemoryRouter>
    );
  });

  it('renders href', () => {
    testRender(<Button href="https://ivesvh.com">Test</Button>);
  });

  it('renders properties', () => {
    testRender(<Button small>Test</Button>);
  });

  it('renders disabled', () => {
    testRender(<Button disabled>Test</Button>);
  });
});
