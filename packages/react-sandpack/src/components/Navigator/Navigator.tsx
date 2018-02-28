import * as React from 'react';
import { listen } from 'codesandbox-api';
import withSandpack from '../../utils/with-sandpack';

import { ISandpackContext } from '../../types';

interface Props {
  sandpack: ISandpackContext;
  test: string;
}

class Navigator extends React.Component<Props> {
  listener: Function;

  constructor(props: Props) {
    super(props);
    this.listener = listen(this.handleMessage);
  }

  componentWillUnmount() {
    this.listener();
  }

  handleMessage = (message: any) => {
    console.log(message);
  };

  render() {
    return <div />;
  }
}

export default withSandpack(Navigator);
