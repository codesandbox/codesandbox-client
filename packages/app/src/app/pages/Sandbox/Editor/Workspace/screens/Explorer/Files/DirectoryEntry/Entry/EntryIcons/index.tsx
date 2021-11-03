import React, { Component } from 'react';
import ErrorIcon from 'react-icons/lib/md/error';

import { RedIcon, SVGIcon } from './elements';
import getIconURL from './GetIconURL';

type Props = {
  type: string;
  width?: number;
  height?: number;
  error?: boolean;
};

class GetIcon extends Component<Props> {
  state = { icon: null };

  mounted = true;

  getIcon = async type => {
    const icon = await getIconURL(type);
    if (this.mounted) {
      this.setState({
        icon,
      });
    }
  };

  async componentDidMount() {
    this.mounted = true;

    this.getIcon(this.props.type);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  async componentDidUpdate(prevProps) {
    if (this.props.type !== prevProps.type) {
      this.getIcon(this.props.type);
    }
  }

  render() {
    const { error, width, height } = this.props;
    const { icon } = this.state;

    if (error) {
      return (
        <RedIcon width={width} height={height}>
          <ErrorIcon width={width} height={height} />
        </RedIcon>
      );
    }
    return <SVGIcon url={icon} width={width} height={height} />;
  }
}

export const EntryIcons: React.FC<Props> = ({
  type,
  width = 16,
  height = 16,
  error,
}) => (
  <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <GetIcon type={type} error={error} width={width} height={height} />
  </div>
);
