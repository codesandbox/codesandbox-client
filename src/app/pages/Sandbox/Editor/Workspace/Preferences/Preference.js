import React from 'react';
import styled from 'styled-components';

import Switch from 'app/components/Switch';
import Tooltip from 'app/components/Tooltip';

const Container = styled.div`
  display: flex;
  padding: 1rem;
  padding-top: 0;
  justify-content: space-between;
  align-items: center;
`;

type Props = {
  title: string,
  enabled: boolean,
  onClick: (on: boolean) => void,
  tooltip: ?string,
  offset: ?number,
};

export default class Preference extends React.Component {
  props: Props;

  handleClick = () => {
    const { enabled, onClick } = this.props;
    onClick(!enabled);
  };

  render() {
    const { title, enabled, tooltip, offset } = this.props;

    const Title = tooltip
      ? <Tooltip right message={tooltip} offset={offset || 50}>{title}</Tooltip>
      : <span>{title}</span>;

    return (
      <Container>
        {Title}
        <Switch
          onClick={this.handleClick}
          small
          offMode
          secondary
          right={enabled}
        />
      </Container>
    );
  }
}
