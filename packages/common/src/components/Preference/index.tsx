import React, { ComponentProps, FunctionComponent } from 'react';

import Tooltip from '../Tooltip';
import { Container } from './elements';
import { PreferenceDropdown } from './PreferenceDropdown';
import { PreferenceKeybinding } from './PreferenceKeybinding';
import { PreferenceNumber } from './PreferenceNumber';
import { PreferenceSwitch } from './PreferenceSwitch';
import { PreferenceText } from './PreferenceText';

type PreferenceType =
  | 'boolean'
  | 'dropdown'
  | 'keybinding'
  | 'number'
  | 'string';

type PreferenceProps<TString extends PreferenceType> = {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  tooltip?: string;
  options?: any[];
  type: TString;
};

export type BooleanPreference = PreferenceProps<'boolean'> &
  ComponentProps<typeof PreferenceSwitch>;

export type StringPreference = PreferenceProps<'string'> &
  ComponentProps<typeof PreferenceText>;

export type DropdownPreference = PreferenceProps<'dropdown'> &
  ComponentProps<typeof PreferenceDropdown>;

export type KeybindingPreference = PreferenceProps<'keybinding'> &
  ComponentProps<typeof PreferenceKeybinding>;

export type NumberPreference = PreferenceProps<'number'> &
  ComponentProps<typeof PreferenceNumber>;

export type Props =
  | BooleanPreference
  | StringPreference
  | DropdownPreference
  | KeybindingPreference
  | NumberPreference;

export const Preference: FunctionComponent<Props> = ({
  className,
  style,
  title,
  tooltip,
  ...contentProps
}) => {
  const getContent = () => {
    switch (
      contentProps.type // need 'type' as discriminant of union type
    ) {
      case 'boolean':
        return <PreferenceSwitch {...contentProps} />;
      case 'string':
        return <PreferenceText {...contentProps} />;
      case 'dropdown':
        return <PreferenceDropdown {...contentProps} />;
      case 'keybinding':
        return <PreferenceKeybinding {...contentProps} />;
      default:
        return <PreferenceNumber {...contentProps} />;
    }
  };

  const Title = tooltip ? (
    <Tooltip content={tooltip} placement="right">
      {title}
    </Tooltip>
  ) : (
    <span>{title}</span>
  );

  return (
    <Container className={className} style={style}>
      {Title}

      <div>{getContent()}</div>
    </Container>
  );
};
