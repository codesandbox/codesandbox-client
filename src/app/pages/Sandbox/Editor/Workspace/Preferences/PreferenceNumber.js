import React from 'react';

import Input from 'app/components/Input';

type Props = {
  value: boolean,
  setValue: boolean => any,
};

export default class PreferenceInput extends React.PureComponent {
  props: Props;

  handleChange = e => {
    const value = e.target.value;

    if (!Number.isNaN(+value)) {
      this.props.setValue(+value);
    }
  };

  render() {
    const { value } = this.props;
    return <Input type="number" value={value} onChange={this.handleChange} />;
  }
}
