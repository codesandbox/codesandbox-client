import React from 'react';

import Progress from '../Progress';

export default class ExportToGithub extends React.PureComponent {
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
