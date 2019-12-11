import * as React from 'react';
import { Subscriber } from 'react-broadcast';

import { ISandpackContext } from '../../types';

export interface Props {
  children: (state: ISandpackContext) => React.ReactNode;
}

export default class SandpackConsumer extends React.PureComponent<Props> {
  render() {
    return <Subscriber channel="sandpack">{this.props.children}</Subscriber>;
  }
}
