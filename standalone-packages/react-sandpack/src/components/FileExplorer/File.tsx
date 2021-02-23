import * as React from 'react';

export interface Props {
  path: string;
  selectFile?: (path: string) => void;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  depth: number;
}

export class File extends React.PureComponent<Props> {
  selectFile = () => {
    if (this.props.selectFile) {
      this.props.selectFile(this.props.path);
    }
  };

  render() {
    const fileName = this.props.path.split('/').filter(Boolean).pop();

    return (
      <button
        className="sp-button"
        type="button"
        onClick={this.props.selectFile ? this.selectFile : this.props.onClick}
        data-active={this.props.active}
        style={{ paddingLeft: 8 * this.props.depth + 'px' }}
      >
        {fileName}
      </button>
    );
  }
}
