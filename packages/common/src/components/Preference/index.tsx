import * as React from 'react';
import Tooltip from '../../components/Tooltip';

import PreferenceSwitch from './PreferenceSwitch';
import PreferenceDropdown, { NameMapper } from './PreferenceDropdown';
import PreferenceNumber from './PreferenceNumber';
import PreferenceText from './PreferenceText';
import PreferenceKeybinding from './PreferenceKeybinding';
import { Container } from './elements';

export type Props = {
  title: string;
  style?: React.CSSProperties;
  className?: string;
  tooltip?: string;
} & (
  | BooleanPreference
  | StringPreference
  | DropdownPreference
  | KeybindingPreference
  | NumberPreference);

type SetValueT<T> = (value: T) => void;

export type BooleanPreference = {
  type: 'boolean';
  value: boolean;
  defaultValue?: boolean;
  setValue: SetValueT<boolean>;
};

export type StringPreference = {
  type: 'string';
  value: string;
  defaultValue?: string;
  setValue: SetValueT<string>;
};



export type DropdownPreference = {
  type: 'dropdown';
  options: string[];
  value: string;
  defaultValue?: string;
  setValue: SetValueT<string>;
  mapName?: NameMapper;
};

export type KeybindingPreference = {
  type: 'keybinding';
  value: Array<string[]>;
  defaultValue?: Array<string[]>;
  setValue: SetValueT<Array<string[]>>;
};

export type NumberPreference = {
  type: 'number';
  value: number;
  defaultValue?: number;
  setValue: SetValueT<number>;
};

export default class Preference extends React.Component<Props> {
  getOptionComponent = () => {
    const props = this.props;
    if (props.type === 'boolean') {
      return (
        <PreferenceSwitch
          {...props}
          setValue={props.setValue}
          value={props.value}
        />
      );
    }

    if (props.type === 'string') {
      return (
        <PreferenceText
          {...props}
          setValue={props.setValue}
          value={props.value}
        />
      );
    }

    if (props.type === 'dropdown') {
      return (
        <PreferenceDropdown
          {...props}
          options={props.options}
          setValue={props.setValue}
          value={props.value}
        />
      );
    }

    if (props.type === 'keybinding') {
      return (
        <PreferenceKeybinding
          {...props}
          setValue={props.setValue}
          value={props.value}
        />
      );
    }

    return (
      <PreferenceNumber
        {...props}
        setValue={props.setValue}
        value={props.value}
      />
    );
  };

  render() {
    const { title, style, className, tooltip } = this.props;

    const Title = tooltip ? (
      <Tooltip position="right" title={tooltip}>
        {title}
      </Tooltip>
    ) : (
      <span>{title}</span>
    );

    return (
      <Container style={style} className={className}>
        {Title}
        <div>{this.getOptionComponent()}</div>
      </Container>
    );
  }
}
