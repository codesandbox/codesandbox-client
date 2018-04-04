import React from 'react';
import { inject, observer } from 'mobx-react';

class Chat extends React.Component {
  render() {
    return <div>Hello World</div>;
  }
}

export default inject('signals', 'store')(observer(Chat));
