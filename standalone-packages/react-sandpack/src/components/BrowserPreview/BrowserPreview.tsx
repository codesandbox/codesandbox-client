import * as React from 'react';

import Preview from '../Preview';
import Navigator from '../Navigator';

export interface Props {
  className?: string;
  style?: Object;
}

export default class BrowserPreview extends React.PureComponent<Props> {
  render() {
    const { className = '', style, ...props } = this.props;

    return (
      <div className={className} style={style} {...props}>
        <Navigator />
        <Preview />
      </div>
    );
  }
}
