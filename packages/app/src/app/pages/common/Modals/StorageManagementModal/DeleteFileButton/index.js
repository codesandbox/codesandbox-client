import * as React from 'react';
import { DeleteFileButton } from './elements';

export default class DeleteFileButtonContainer extends React.PureComponent {
  deleteFile = () => {
    this.props.onDelete({ id: this.props.id });
  };

  render() {
    return <DeleteFileButton onClick={this.deleteFile} />;
  }
}
