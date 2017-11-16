// @flow

import React from 'react';

import Progress from './Progress';

type Props = {
  promise: Promise<{ newBranch: ?string, merge: ?string }>,
  closeModal: Function,
};

type State = {
  message: ?React.Element<{}>,
};

export default class ExportToGithub extends React.PureComponent<Props, State> {
  state = {
    message: null,
  };

  componentDidMount() {
    this.awaitExport();
  }

  awaitExport = async () => {
    await this.props.promise;
    const { closeModal } = this.props;

    const message = <div>Exported to GitHub!</div>;

    setTimeout(() => {
      closeModal();
    }, 1000);

    this.setState({
      message,
    });
  };

  render() {
    const { message } = this.state;
    return <Progress result={message} message="Creating Repository..." />;
  }
}
