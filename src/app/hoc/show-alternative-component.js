import { createElement } from 'react';

/**
 * Shows a loading component if any of the props provided by `fields` does
 * not exist
 */
export default (LoadingComponent, fields = []) => Component => props => {
  const componentLoaded = fields.every(
    field => typeof props[field] !== 'undefined' && props[field] !== null
  );

  if (componentLoaded) {
    return createElement(Component, props);
  }

  return createElement(LoadingComponent, props);
};

// AlternativeComponent(LoadingComponent, ['field'])(Component)
