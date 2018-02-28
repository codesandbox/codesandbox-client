import * as React from 'react';

import SandpackConsumer from '../SandpackConsumer';
import Preview from '../Preview';
import Navigator from '../Navigator';

import cn from '../../utils/cn';

export interface Props {}

export default class BrowserPreview extends React.PureComponent<Props> {
  render() {
    return (
      <React.Fragment>
        <Navigator />
        <Preview />
      </React.Fragment>
    );
  }
}
