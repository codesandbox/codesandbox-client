import React from 'react';
import Tooltip from '../../components/Tooltip';

import PreferenceSwitch, { Props as SwitchProps } from './PreferenceSwitch';
import PreferenceDropdown, {
  Props as DropdownProps,
} from './PreferenceDropdown';
import PreferenceNumber, { Props as NumberProps } from './PreferenceNumber';
import PreferenceText, { Props as TextProps } from './PreferenceText';
import PreferenceKeybinding, {
  Props as KeybindingProps,
} from './PreferenceKeybinding';
import { Container } from './elements';

type PreferenceType =
  | 'boolean'
  | 'string'
  | 'dropdown'
  | 'keybinding'
  | 'number';

type PreferenceProps<TString extends PreferenceType> = {
  type: TString;
  title: string;
  style?: React.CSSProperties;
  className?: string;
  tooltip?: string;
};

export type BooleanPreference = PreferenceProps<'boolean'> & SwitchProps;

export type StringPreference = PreferenceProps<'string'> & TextProps;

export type DropdownPreference = PreferenceProps<'dropdown'> & DropdownProps;

export type KeybindingPreference = PreferenceProps<'keybinding'> &
  KeybindingProps;

export type NumberPreference = PreferenceProps<'number'> & NumberProps;

export type Props =
  | BooleanPreference
  | StringPreference
  | DropdownPreference
  | KeybindingPreference
  | NumberPreference;

const Preference = (props: Props) => {
  const { title, style, className, tooltip, ...contentProps } = props;

  let content: React.ReactNode;
  switch (
    contentProps.type // need 'type' as discriminant of union type
  ) {
    case 'boolean':
      content = <PreferenceSwitch {...contentProps} />;
      break;
    case 'string':
      content = <PreferenceText {...contentProps} />;
      break;
    case 'dropdown':
      content = <PreferenceDropdown {...contentProps} />;
      break;
    case 'keybinding':
      content = <PreferenceKeybinding {...contentProps} />;
      break;
    default:
      content = <PreferenceNumber {...contentProps} />;
  }

  const Title = tooltip ? (
    <Tooltip placement="right" content={tooltip}>
      {title}
    </Tooltip>
  ) : (
    <span>{title}</span>
  );

  return (
    <Container style={style} className={className}>
      {Title}
      <div>{content}</div>
    </Container>
  );
};

export default Preference;
