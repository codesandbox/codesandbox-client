import React from 'react';
import Tooltip from 'common/components/Tooltip';

import PreferenceSwitch from './PreferenceSwitch';
import PreferenceDropdown from './PreferenceDropdown';
import PreferenceNumber from './PreferenceNumber';
import PreferenceText from './PreferenceText';
import PreferenceKeybinding from './PreferenceKeybinding';
import { Container } from './elements';

export default class Preference extends React.Component {
  getOptionComponent = value => {
    const { type } = this.props;
    if (type === 'boolean') {
      return (
        <PreferenceSwitch
          {...this.props}
          setValue={this.props.setValue}
          value={value}
        />
      );
    }

    if (type === 'string') {
      return (
        <PreferenceText
          {...this.props}
          setValue={this.props.setValue}
          value={value}
        />
      );
    }

    if (type === 'dropdown') {
      return (
        <PreferenceDropdown
          {...this.props}
          options={this.props.options}
          setValue={this.props.setValue}
          value={value}
        />
      );
    }

    if (type === 'keybinding') {
      return (
        <PreferenceKeybinding
          {...this.props}
          options={this.props.options}
          setValue={this.props.setValue}
          value={value}
        />
      );
    }

    return (
      <PreferenceNumber
        {...this.props}
        setValue={this.props.setValue}
        value={value}
      />
    );
  };

  render() {
    const { title, style, className, value, tooltip } = this.props;

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
        <div>{this.getOptionComponent(value)}</div>
      </Container>
    );
  }
}
