import * as React from 'react';
import { DeleteSandboxButton } from './elements';

export default class DeleteSandboxButtonContainer extends React.PureComponent {
  deleteSandbox = () => {
    this.props.onDelete(this.props.id);
  };

  render() {
    return <DeleteSandboxButton onClick={this.deleteSandbox} />;
  }
}
