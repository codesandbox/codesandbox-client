// @flow
import React from 'react';
import styled from 'styled-components';

import Logo from 'app/components/Logo';
import Row from 'app/components/flex/Row';

import User from './User';

const LogoWithBorder = styled(Logo)`
  padding-right: 1rem;
`;

const Border = styled.hr`
  display: inline-block;
  height: 28px;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.4);
`;

const Title = styled.h1`
  margin-left: 1rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 300;
`;

type Props = {
  title: string,
  user: {
    username: string,
    name: string,
    avatarUrl: string,
  },
};

export default class Location extends React.PureComponent {
  props: Props;
  render() {
    const { title, user } = this.props;
    return (
      <Row justifyContent="space-between">
        <Row>
          <LogoWithBorder height={42} width={42} />
          <Border width={1} size={500} />
          <Title>{title}</Title>
        </Row>
        <Row>
          <User user={user} />
        </Row>
      </Row>
    );
  }
}
