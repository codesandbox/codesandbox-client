import * as React from 'react';

import Preview from '../../../../pages/Sandbox/Editor/Content/Preview';

interface Props {
  hidden: boolean;
}

class Browser extends React.PureComponent<Props> {
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
