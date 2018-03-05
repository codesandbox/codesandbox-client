import * as React from 'react';
import classNames from 'classnames';

import cn from '../../../utils/cn';

export interface Props {
  path: string;
  selectFile: (path: string) => void;
  active?: boolean;
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

    const className = classNames(cn('File', 'container'), {
      [cn('File', 'active')]: this.props.active,
    });

    return (
      <div onClick={this.selectFile} className={className}>
        {fileName}
      </div>
    );
  }
}
