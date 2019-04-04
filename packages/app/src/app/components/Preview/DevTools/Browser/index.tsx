import * as React from 'react';

import Preview from '../../../../pages/Sandbox/Editor/Content/Preview';
import { DevToolProps } from '..';

class Browser extends React.PureComponent<DevToolProps> {
  render() {
    return (
      <Preview hidden={this.props.hidden} width={'100%'} height={'100%'} />
    );
  }
}

export default {
  id: 'codesandbox.browser',
  title: 'Browser',
  Content: Browser,
  actions: [],
};
