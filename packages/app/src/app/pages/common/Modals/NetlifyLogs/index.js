import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import { Button } from 'common/lib/components/Button';
import { Container } from '../LiveSessionEnded/elements';
import { Heading, Explanation } from '../elements';

import { List, Item } from './elements';

const counter = 0;
function dotdotdot(cursor, times, string) {
  return Array(times - Math.abs((cursor % (times * 2)) - times) + 1).join(
    string
  );
}

class NetlifyLogs extends Component {
  state = { logs: ['Contacting Netlify'] };

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
        <Explanation>
          Builds typically take a minute or two to complete
        </Explanation>
        <List>
          {this.state.logs.map((log, i) => <Item key={`log-${i}`}>{log}</Item>)}
        </List>
        <Button onClick={() => signals.modalClosed()}>Close</Button>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(NetlifyLogs));
