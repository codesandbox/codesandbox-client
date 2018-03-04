import * as React from 'react';

import cn from '../../../utils/cn';

export interface Props {
  path: string;
  selectFile: (path: string) => void;
}

export default class File extends React.PureComponent<Props> {
  selectFile = () => {
    this.props.selectFile(this.props.path);
  };

  render() {
    const fileName = this.props.path
      .split('/')
      .filter(Boolean)
      .pop();

    return (
      <div onClick={this.selectFile} className={cn('File', 'container')}>
        {fileName}
      </div>
    );
  }
}
