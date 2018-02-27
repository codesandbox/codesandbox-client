import * as React from 'react';

import SandpackConsumer from '../SandpackConsumer';
import Preview from '../Preview';

export default class BrowserPreview extends React.PureComponent {
  render() {
    return (
      <div>
        This is the navigation
        <Preview />
      </div>
    );
  }
}
