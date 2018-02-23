import React from 'react';
import Switch from 'common/components/Switch';

export default class PreferenceSwitch extends React.Component {
  handleClick = () => {
    this.props.setValue(!this.props.value);
  };

  render() {
    const { value } = this.props;
    return (
      <Switch
        onClick={this.handleClick}
        small
        style={{ width: '3rem' }}
        offMode
        secondary
        right={value}
      />
    );
  }
}
