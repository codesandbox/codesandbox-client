import React from 'react';

import RecordIcon from 'react-icons/lib/md/fiber-manual-record';
import { DotContainer } from './elements';

export class BlinkingDot extends React.PureComponent<{}, { showing: boolean }> {
  timer: NodeJS.Timeout;
  state = {
    showing: true,
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState(state => ({ showing: !state.showing }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <DotContainer>
        <RecordIcon style={{ opacity: this.state.showing ? 1 : 0 }} />
      </DotContainer>
    );
  }
}
