import React from 'react';
import { AddFileToSandboxButton } from './elements';

export default class AddFileToSandboxButtonContainer extends React.PureComponent {
  addFileToSandbox = () => {
    const { onAddFileToSandbox, url, name } = this.props;
    onAddFileToSandbox({ url, name });
  };

  render() {
    return <AddFileToSandboxButton onClick={this.addFileToSandbox} />;
  }
}
