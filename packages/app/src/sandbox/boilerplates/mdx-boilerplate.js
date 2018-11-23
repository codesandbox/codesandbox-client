import React from 'react';
import { render } from 'react-dom';

export default function(module: string) {
  if (!module.__csbMdx) {
    return;
  }

  const node = document.createElement('div');
  document.body.appendChild(node);

  const components = {
    a: props => {
      if (props.href && props.href.startsWith('.')) {
        return (
          <a
            {...props}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              const api = require('codesandbox-api');

              api.dispatch(
                api.actions.editor.openModule(props.href.replace('.', ''))
              );
            }}
          />
        );
      }

      return <a target="_blank" rel="noopener noreferrer" {...props} />;
    },
  };

  render(React.createElement(module.__csbMdx, { components }), node);
}
