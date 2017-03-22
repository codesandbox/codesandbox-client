import React from 'react';
import styled from 'styled-components';

import Switch from 'app/components/Switch';

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
};

export default class Preference extends React.Component {
  props: Props;

  handleClick = () => {
    const { enabled, onClick } = this.props;
    onClick(!enabled);
  };

  render() {
    const { title, enabled } = this.props;

    return (
      <Container>
        {title}
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
