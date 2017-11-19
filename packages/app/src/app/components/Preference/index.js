import React from 'react';
import styled from 'styled-components';
import Tooltip from 'app/components/Tooltip';

import PreferenceSwitch from './PreferenceSwitch';
import PreferenceDropdown from './PreferenceDropdown';
import PreferenceNumber from './PreferenceNumber';
import PreferenceText from './PreferenceText';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  className: ?string,
  title: string,
  value: any,
  setValue: (value: any) => any,
  tooltip: ?string,
  type: 'boolean' | 'number' | 'string',
  options: ?Array<string>,
};

export default class Preference extends React.Component {
  props: Props;

  getOptionComponent = (value: boolean | number | string) => {
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

    return (
      <PreferenceNumber
        {...this.props}
        setValue={this.props.setValue}
        value={value}
      />
    );
  };

  render() {
    const { title, className, value, tooltip } = this.props;

    const Title = tooltip ? (
      <Tooltip position="right" title={tooltip}>
        {title}
      </Tooltip>
    ) : (
      <span>{title}</span>
    );

    return (
      <Container className={className}>
        {Title}
        <div>{this.getOptionComponent(value)}</div>
      </Container>
    );
  }
}
