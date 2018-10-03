import React, { Component } from 'react';

import ErrorIcon from 'react-icons/lib/md/error';

import { RedIcon, SVGIcon } from './elements';
import getIconURL from './GetIconURL';

class GetIcon extends Component {
  state = { icon: null };

  getIcon = async type => {
    const icon = await getIconURL(type);

    this.setState({
      icon,
    });
  };

  async componentDidMount() {
    this.getIcon(this.props.type);
  }

  async componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.getIcon(this.props.type);
    }
  }

  render() {
    const { type, error, width, height } = this.props;
    const { icon } = this.state;

    if (error) {
      return (
        <RedIcon>
          <ErrorIcon width={width} height={height} />
        </RedIcon>
      );
    }
    return <SVGIcon url={icon} type={type} width={width} height={height} />;
  }
}

function EntryIcon({ type, width = 16, height = 16, error }) {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <GetIcon type={type} error={error} width={width} height={height} />
    </div>
  );
}

EntryIcon.defaultProps = {
  isOpen: false,
};

export default EntryIcon;
