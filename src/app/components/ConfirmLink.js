// @flow
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  enabled: boolean,
  message: string,
};

export default class ConfirmLink extends React.PureComponent {
  props: Props;
  confirm = (e: Event) => {
    const { enabled, message } = this.props;

    if (enabled) {
      const yes = confirm(message);

      if (!yes) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  render() {
    const { enabled, message, ...props } = this.props;
    return <Link onClick={this.confirm} {...props} />;
  }
}
