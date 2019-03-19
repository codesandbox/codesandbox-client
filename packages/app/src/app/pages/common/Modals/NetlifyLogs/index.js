import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';
import { Container } from '../LiveSessionEnded/elements';
import { Heading } from '../elements';

import { List, Item } from './elements';

class NetlifyLogs extends Component {
  state = { logs: [] };

  componentDidMount() {
    this.interval = setInterval(this.getLogs, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getLogs = async () => {
    const url = this.props.store.deployment.netlifyLogs;

    const data = await fetch(url);
    const { logs } = await data.json();

    this.setState({ logs });
  };
  render() {
    const { signals } = this.props;

    return (
      <Container>
        <Heading>Sandbox Site Logs</Heading>
        <List>{this.state.logs.map(log => <Item>{log}</Item>)}</List>
        <Button onClick={() => signals.modalClosed()}>Close</Button>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(NetlifyLogs));
