import * as React from 'react';
import Select from '../Select';

export type NameMapper = (param: string) => string;

export type Props = {
  setValue: (value: string) => void;
  value: string;
  options: string[];
  mapName?: NameMapper;
};

export default class PreferenceInput extends React.PureComponent<Props> {
  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    this.props.setValue(value);
  };

  render() {
    const { value, options, mapName } = this.props;

    return (
      <Select onChange={this.handleChange} value={value}>
        {options.map(op => (
          <option key={op} value={op}>
            {mapName ? mapName(op) : op}
          </option>
        ))}
      </Select>
    );
  }
}
