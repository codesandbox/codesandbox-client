import React from 'react';

import { Container } from './elements';

const DOWNTIME_TIME = 1521853200000;

const pad = t => {
  if (`${t}`.length === 1) {
    return `0${t}`;
  }

  return `${t}`;
};

class ConnectionNotice extends React.PureComponent {
  state = {
    downtimeTime: 0,
    niceTime: null,
  };

  componentDidMount() {
    this.timer = setTimeout(this.tick, 1000);
  }

  index = 0;
  tick = () => {
    this.forceUpdate();
    if (++this.index >= 30) {
      this.index = 0;

      fetch(
        'https://s3-eu-west-1.amazonaws.com/codesandbox-downtime/downtime.json'
      )
        .then(a => a.json())
        .then(data => {
          this.setState({ downtimeTime: data.time, niceTime: data.niceTime });
        })
        .catch(() => this.setState({ downtimeTime: 0, niceTime: null }));
    }

    this.timer = setTimeout(this.tick, 1000);
  };

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getTimes = () => {
    const delta = this.state.downtimeTime - new Date().getTime();

    const hours = Math.floor(delta / 1000 / 60 / 60);
    const minutes = Math.floor((delta - hours * 1000 * 60 * 60) / 1000 / 60);
    const seconds = Math.floor(
      (delta - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000
    );

    return { hours, minutes, seconds };
  };

  renderCountdown = () => {
    const { hours, minutes, seconds } = this.getTimes();

    return (
      <span>
        {`${hours >= 0 ? pad(hours) : '00'}:`}
        {pad(minutes)}:{pad(seconds)}
      </span>
    );
  };

  render() {
    if (!this.state.downtimeTime) {
      return null;
    }

    if (Date.now() > this.state.downtimeTime) {
      return (
        <Container>
          <p style={{ fontWeight: 700, marginTop: 0 }}>MAINTENANCE NOTICE</p>
          We are migrating our servers to Google Cloud Platform. This will take
          between 5 and 15 minutes.
          <p style={{ marginBottom: 0 }}>
            The editor will still work as usual, but we have disabled saving and
            forking during the migration.
          </p>
        </Container>
      );
    }

    // 10 minutes
    if (this.state.downtimeTime - Date.now() > 1000 * 60 * 10) {
      return null;
    }

    return (
      <Container>
        <p style={{ fontWeight: 700, marginTop: 0 }}>MAINTENANCE NOTICE</p>
        We will migrate our servers to Google Cloud Platform in{' '}
        <span style={{ fontWeight: 700 }}>{this.renderCountdown()}</span>
        {this.state.niceTime ? ` ${this.state.niceTime}` : ''}.
        <p style={{ marginBottom: 0 }}>
          The editor will still work as usual, but we have disabled saving and
          forking during the migration. Make sure to save your work beforehand.
        </p>
      </Container>
    );
  }
}

export default ConnectionNotice;
