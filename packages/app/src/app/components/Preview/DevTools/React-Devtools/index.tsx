import React from 'react';
import ReactDevTools from '../../../../../../../../standalone-packages/react-devtools-experimental/shells/dev/dist/devtools';

import { Container } from './elements';

interface Props {
  hidden: boolean;
}

class DevTools extends React.PureComponent<Props> {
  render() {
    // if (this.props.hidden) {
    //   return null;
    // }

    return (
      <Container>
        <ReactDevTools />
      </Container>
    );
  }
}

export default {
  id: 'codesandbox.devtools',
  title: 'React DevTools',
  Content: DevTools,
  actions: [],
};
