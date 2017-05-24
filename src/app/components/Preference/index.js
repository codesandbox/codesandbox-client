import React from 'react';
import styled from 'styled-components';
import Tooltip from 'app/components/Tooltip';

import PreferenceSwitch from './PreferenceSwitch';
import PreferenceNumber from './PreferenceNumber';

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
};

export default class Preference extends React.Component {
  props: Props;

  getOptionComponent = (value: boolean | number) => {
    if (typeof value === 'boolean') {
      return <PreferenceSwitch setValue={this.props.setValue} value={value} />;
    }

    return <PreferenceNumber setValue={this.props.setValue} value={value} />;
  };

  render() {
    const { title, className, value, tooltip } = this.props;

    const Title = tooltip
      ? <Tooltip position="right" title={tooltip}>{title}</Tooltip>
      : <span>{title}</span>;

    return (
      <Container className={className}>
        {Title}
        <div style={{ width: 48 }}>
          {this.getOptionComponent(value)}
        </div>
      </Container>
    );
  }
}
