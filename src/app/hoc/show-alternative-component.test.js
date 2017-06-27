import React from 'react';
import testRemder from 'app/utils/test/render';

import showAlternativeComponent from './show-alternative-component';

describe('hoc', () => {
  describe('show-alternative-component', () => {
    const LoadingComponent = () => <div>Loading</div>;
    const AppComponent = () => <div>App</div>;
    it("renders loading component if prop doesn't exist", () => {
      const ComposedComponent = showAlternativeComponent(LoadingComponent, [
        'field',
      ])(AppComponent);

      testRemder(<ComposedComponent />);
    });

    it('renders app if prop exists', () => {
      const ComposedComponent = showAlternativeComponent(LoadingComponent, [
        'field',
      ])(AppComponent);

      testRemder(<ComposedComponent field="test" />);
    });

    it('renders app if prop exists and is falsy', () => {
      const ComposedComponent = showAlternativeComponent(LoadingComponent, [
        'field',
      ])(AppComponent);

      testRemder(<ComposedComponent field={false} />);
    });

    it('only renders app if all prop exists and is falsy', () => {
      const ComposedComponent = showAlternativeComponent(LoadingComponent, [
        'field',
        'field2',
      ])(AppComponent);

      testRemder(<ComposedComponent field={false} />);
      testRemder(<ComposedComponent field={false} field2={false} />);
    });
  });
});
