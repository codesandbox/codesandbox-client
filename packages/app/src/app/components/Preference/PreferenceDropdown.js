import React from 'react';

import Select from 'app/components/Select';

type Props = {
  value: boolean,
  setValue: boolean => any,
  options: Array<string>,
};

export default class PreferenceInput extends React.PureComponent {
  props: Props;

  handleChange = e => {
    const value = e.target.value;

    this.props.setValue(value);
  };

  render() {
    const { value, options } = this.props;
    return (
      <Select onChange={this.handleChange} value={value}>
        {options.map(op => <option key={op}>{op}</option>)}
      </Select>
    );
  }
}
