import React from 'react';
import styled from 'styled-components';
import { camelizeKeys } from 'humps';
import 'whatwg-fetch';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import Centered from 'app/components/flex/Centered';
import Fullscreen from 'app/components/flex/Fullscreen';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';

import Header from './components/Header';
import Content from './components/Content';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: white;
`;

type State = {
  notFound: boolean,
  sandbox: Sandbox,
};

export default class App extends React.PureComponent {
  state: State = {
    notFound: false,
    sandbox: null,
  };

  getId = () => {
    const matches = location.pathname.match(/^\/embed\/(.*?)(\/|$)/);

    if (matches && matches.length > 1) {
      return matches[1];
    }
    return null;
  };

  getAppOrigin = () => {
    return location.origin.replace('embed.', '');
  };

  fetchSandbox = async (id: string) => {
    try {
      const response = await fetch(
        `${this.getAppOrigin()}/api/v1/sandboxes/${id}`
      )
        .then(res => res.json())
        .then(camelizeKeys);

      console.log(response.data);
      this.setState({
        sandbox: response.data,
      });
    } catch (e) {
      this.setState({ notFound: true });
    }
  };

  componentDidMount() {
    const id = this.getId();

    if (!id) {
      this.setState({ notFound: true });
      return;
    }

    this.fetchSandbox(id);
  }

  content = () => {
    if (this.state.notFound) {
      return (
        <Centered vertical horizontal>
          <Title delay={0.1}>Not Found</Title>
          <SubTitle delay={0.05}>
            We couldn{"'"}t find the sandbox you{"'"}re looking for.
          </SubTitle>
        </Centered>
      );
    }

    if (!this.state.sandbox) {
      return (
        <Centered vertical horizontal>
          <Title delay={0.3}>Loading Sandbox...</Title>
        </Centered>
      );
    }

    return (
      <Container>
        <Header sandbox={this.state.sandbox} />
        <Content sandbox={this.state.sandbox} />
      </Container>
    );
  };

  render() {
    return <Fullscreen>{this.content()}</Fullscreen>;
  }
}
