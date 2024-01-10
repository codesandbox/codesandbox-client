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
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  title?: string;
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
  innerClassName,
  innerStyle,
  ...contentProps
}) => {
  const getContent = () => {
    const stylingProps = {
      className: innerClassName,
      style: innerStyle,
    };
    switch (
      contentProps.type // need 'type' as discriminant of union type
    ) {
      case 'boolean':
        return <PreferenceSwitch {...stylingProps} {...contentProps} />;
      case 'string':
        return <PreferenceText {...stylingProps} {...contentProps} />;
      case 'dropdown':
        return <PreferenceDropdown {...stylingProps} {...contentProps} />;
      case 'keybinding':
        return <PreferenceKeybinding {...stylingProps} {...contentProps} />;
      case 'number':
        return <PreferenceNumber {...stylingProps} {...contentProps} />;
      default: {
        return null;
      }
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
      {title ? Title : null}

      <div>{getContent()}</div>
    </Container>
  );
};
