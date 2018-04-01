import React from 'react';
import Select from 'common/components/Select';

export default class PreferenceInput extends React.PureComponent {
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
