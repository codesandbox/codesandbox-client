import React from 'react';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import RefreshIcon from 'react-icons/lib/md/refresh';

import { UpdateContainer, UpdateMessage } from './elements';

export default class UpdateFound extends React.PureComponent {
  state = {
    showTooltipManually: true,
  };

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.setState({ showTooltipManually: false });
    }, 60000);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render() {
    return (
      <UpdateContainer {...this.props}>
        <Tooltip
          theme="update"
          content={
            <UpdateMessage
              id="update-message"
              onClick={() => document.location.reload()}
            />
          }
          isVisible={this.state.showTooltipManually}
          trigger={
            this.state.showTooltipManually ? 'manual' : 'mouseenter focus'
          }
          arrow
          distance={15}
        >
          <RefreshIcon />
        </Tooltip>
      </UpdateContainer>
    );
  }
}
