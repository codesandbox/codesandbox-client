import * as React from 'react';
import Switch from '../Switch';

export type Props = {
  value: boolean;
  setValue: (val: boolean) => void;
};

export default class PreferenceSwitch extends React.Component<Props> {
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
